#!/usr/bin/env python3
"""Deterministic, side-effect-free Docker runtime contract validator.

The validator reads Docker inspect JSON from regular files, compares only
allowlisted runtime fields, and emits one bounded JSON result. It never invokes
Docker and never mutates the host, so diagnostics, repairs, and deployments can
all execute the same validation bytes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import sys
from pathlib import Path
from typing import Any

SCHEMA_VERSION = 1
PROFILE = "endurocide-shared-runtime-validator-v1"
MAX_INPUT_BYTES = 262_144
MAX_OUTPUT_BYTES = 16_384
MAX_MISMATCHES = 64
MAX_TOKENS = 32

NCA_COMMIT = "9ba586d54d463004328b2235daae6de3ec9a2ef9"
NCA_IMAGE = f"nca-website:{NCA_COMMIT}"
CADDY_IMAGE = "caddy@sha256:d8c17a862962def15cde69863a3a463f25a2664942eafd7bdbf050e9c3116b83"
NCA_APP = "nca-pilot-nca-site-1"
NCA_EDGE = "nca-edge"
EDGE_DIR = Path("/opt/harbor-hub/edge/nca-pilot")
CADDYFILE = EDGE_DIR / "Caddyfile"

EXPECTED = {
    "application": {
        "name": f"/{NCA_APP}",
        "image": NCA_IMAGE,
        "project": "nca-pilot",
        "service": "nca-site",
        "memoryBytes": 268_435_456,
        "nanoCpus": 500_000_000,
        "pidsLimit": 100,
        "capAdd": [],
        "capDrop": ["ALL"],
        "securityOptions": ["no-new-privileges:true"],
        "networkNames": ["harbor-edge"],
        "networkAliases": [NCA_APP, "nca-site"],
        "hostPorts": [],
        "exposedPorts": ["8080/tcp"],
        "mounts": {},
    },
    "edge": {
        "name": f"/{NCA_EDGE}",
        "image": CADDY_IMAGE,
        "project": "nca-edge",
        "service": "nca-edge",
        "memoryBytes": 201_326_592,
        "nanoCpus": 350_000_000,
        "pidsLimit": 100,
        "capAdd": ["NET_BIND_SERVICE"],
        "capDrop": ["ALL"],
        "securityOptions": ["no-new-privileges:true"],
        "networkNames": ["harbor-edge"],
        "networkAliases": [],
        "hostPorts": [80, 443],
        "exposedPorts": ["2019/tcp", "443/tcp", "443/udp", "80/tcp"],
        "mounts": {
            "/etc/caddy/Caddyfile": [str(CADDYFILE), False],
            "/data": [str(EDGE_DIR / "data"), True],
            "/config": [str(EDGE_DIR / "config"), True],
        },
    },
}

ALLOWED_COMPOSE_LABEL_KEYS = {
    "com.docker.compose.config-hash",
    "com.docker.compose.container-number",
    "com.docker.compose.depends_on",
    "com.docker.compose.image",
    "com.docker.compose.oneoff",
    "com.docker.compose.project",
    "com.docker.compose.project.config_files",
    "com.docker.compose.project.working_dir",
    "com.docker.compose.replace",
    "com.docker.compose.service",
    "com.docker.compose.version",
}


class InputError(Exception):
    pass


def read_json_file(path: Path) -> Any:
    descriptor = -1
    try:
        flags = os.O_RDONLY | os.O_CLOEXEC
        if hasattr(os, "O_NOFOLLOW"):
            flags |= os.O_NOFOLLOW
        descriptor = os.open(path, flags)
        info = os.fstat(descriptor)
        if not stat.S_ISREG(info.st_mode) or info.st_size <= 0 or info.st_size > MAX_INPUT_BYTES:
            raise InputError("input_file_invalid")
        chunks: list[bytes] = []
        remaining = MAX_INPUT_BYTES + 1
        while remaining:
            chunk = os.read(descriptor, min(65_536, remaining))
            if not chunk:
                break
            chunks.append(chunk)
            remaining -= len(chunk)
        raw = b"".join(chunks)
        if len(raw) > MAX_INPUT_BYTES:
            raise InputError("input_file_oversized")
        return json.loads(raw.decode("utf-8"))
    except InputError:
        raise
    except Exception as error:
        raise InputError("input_json_invalid") from error
    finally:
        if descriptor >= 0:
            os.close(descriptor)


def one_container(value: Any) -> dict[str, Any]:
    if isinstance(value, list) and len(value) == 1 and isinstance(value[0], dict):
        return value[0]
    if isinstance(value, dict):
        return value
    raise InputError("container_inspect_shape_invalid")


def normalize_capabilities(value: Any) -> tuple[list[str], bool]:
    if value is None:
        return [], True
    if not isinstance(value, list) or len(value) > MAX_TOKENS:
        return [], False
    normalized: list[str] = []
    for item in value:
        token = str(item).strip().upper()
        if token.startswith("CAP_"):
            token = token[4:]
        if re.fullmatch(r"[A-Z0-9_]{1,64}", token) is None:
            return [], False
        normalized.append(token)
    return sorted(set(normalized)), len(normalized) == len(set(normalized))


def normalize_security_options(value: Any) -> tuple[list[str], bool]:
    if value is None:
        return [], True
    if not isinstance(value, list) or len(value) > MAX_TOKENS:
        return [], False
    normalized: list[str] = []
    for item in value:
        token = str(item).strip().lower().replace("=", ":")
        if token == "no-new-privileges":
            token = "no-new-privileges:true"
        if re.fullmatch(r"[a-z0-9_.:,/-]{1,128}", token) is None:
            return [], False
        normalized.append(token)
    return sorted(set(normalized)), len(normalized) == len(set(normalized))


def parse_tmpfs(host: dict[str, Any]) -> tuple[dict[str, Any], bool]:
    value = host.get("Tmpfs")
    if not isinstance(value, dict) or set(value) != {"/tmp"}:
        return {"destinations": sorted(str(key) for key in value) if isinstance(value, dict) else [], "tokens": []}, False
    raw_tokens = [token.strip().lower() for token in str(value["/tmp"]).split(",") if token.strip()]
    if len(raw_tokens) > MAX_TOKENS or len(raw_tokens) != len(set(raw_tokens)):
        return {"destinations": ["/tmp"], "tokens": sorted(set(raw_tokens))}, False
    sizes: list[int] = []
    modes: list[str] = []
    flags: list[str] = []
    unknown: list[str] = []
    for token in raw_tokens:
        if token.startswith("size="):
            match = re.fullmatch(r"size=(\d+)([kmgt]?)", token)
            if match is None:
                unknown.append(token)
            else:
                multiplier = {"": 1, "k": 1024, "m": 1_048_576, "g": 1_073_741_824, "t": 1_099_511_627_776}[match.group(2)]
                sizes.append(int(match.group(1)) * multiplier)
        elif token.startswith("mode=") and re.fullmatch(r"mode=[0-7]{3,4}", token):
            modes.append(token[5:])
        elif re.fullmatch(r"[a-z0-9_-]{1,32}", token):
            flags.append(token)
        else:
            unknown.append(token)
    projection = {
        "destinations": ["/tmp"],
        "tokens": sorted(raw_tokens),
        "sizeBytes": sizes[0] if len(sizes) == 1 else None,
        "mode": modes[0] if len(modes) == 1 else None,
        "flags": sorted(flags),
        "unknownTokens": sorted(unknown),
    }
    matches = len(sizes) == 1 and len(modes) == 1 and sizes[0] == 33_554_432 and modes[0] == "1777" and sorted(flags) in ([], ["rw"]) and not unknown
    return projection, matches


def safe_int(value: Any) -> int:
    try:
        return int(value or 0)
    except (TypeError, ValueError):
        return 0


def project_container(container: dict[str, Any]) -> dict[str, Any]:
    config = container.get("Config") if isinstance(container.get("Config"), dict) else {}
    state = container.get("State") if isinstance(container.get("State"), dict) else {}
    health = state.get("Health") if isinstance(state.get("Health"), dict) else {}
    host = container.get("HostConfig") if isinstance(container.get("HostConfig"), dict) else {}
    network_settings = container.get("NetworkSettings") if isinstance(container.get("NetworkSettings"), dict) else {}
    networks = network_settings.get("Networks") if isinstance(network_settings.get("Networks"), dict) else {}
    labels = config.get("Labels") if isinstance(config.get("Labels"), dict) else {}
    compose_labels = {str(key): str(value) for key, value in labels.items() if str(key).startswith("com.docker.compose.")}

    cap_add, cap_add_valid = normalize_capabilities(host.get("CapAdd"))
    cap_drop, cap_drop_valid = normalize_capabilities(host.get("CapDrop"))
    security, security_valid = normalize_security_options(host.get("SecurityOpt"))
    tmpfs, tmpfs_valid = parse_tmpfs(host)

    aliases: list[str] = []
    aliases_valid = len(networks) <= 4
    for network in networks.values():
        values = network.get("Aliases") if isinstance(network, dict) else None
        if not isinstance(values, list) or len(values) > MAX_TOKENS:
            aliases_valid = False
            continue
        for alias in values:
            token = str(alias)
            if re.fullmatch(r"[A-Za-z0-9_.-]{1,128}", token) is None:
                aliases_valid = False
            else:
                aliases.append(token)
    if len(aliases) != len(set(aliases)):
        aliases_valid = False

    bindings = host.get("PortBindings") if isinstance(host.get("PortBindings"), dict) else {}
    host_ports: list[int] = []
    bindings_valid = True
    for key, entries in bindings.items():
        if not isinstance(entries, list) or len(entries) != 1 or not isinstance(entries[0], dict):
            bindings_valid = False
            continue
        entry = entries[0]
        port = str(entry.get("HostPort", ""))
        if not port.isdigit() or entry.get("HostIp") not in ("", "0.0.0.0"):
            bindings_valid = False
            continue
        host_ports.append(int(port))
        if key != f"{port}/tcp":
            bindings_valid = False

    mounts_raw = container.get("Mounts")
    mounts_valid = isinstance(mounts_raw, list)
    mounts: dict[str, list[Any]] = {}
    if mounts_valid:
        for item in mounts_raw:
            if not isinstance(item, dict) or item.get("Type") != "bind":
                mounts_valid = False
                continue
            destination = str(item.get("Destination", ""))
            source = str(item.get("Source", ""))
            if not destination.startswith("/") or not source.startswith("/") or destination in mounts:
                mounts_valid = False
                continue
            mounts[destination] = [source, item.get("RW")]

    exposed = config.get("ExposedPorts") if isinstance(config.get("ExposedPorts"), dict) else {}
    return {
        "name": str(container.get("Name", "")),
        "image": str(config.get("Image", "")),
        "running": state.get("Running") is True,
        "health": str(health.get("Status", "")),
        "composeProject": compose_labels.get("com.docker.compose.project", ""),
        "composeService": compose_labels.get("com.docker.compose.service", ""),
        "composeContainerNumber": compose_labels.get("com.docker.compose.container-number", ""),
        "composeOneoff": compose_labels.get("com.docker.compose.oneoff", ""),
        "composeLabelKeys": sorted(compose_labels),
        "restartPolicy": str((host.get("RestartPolicy") or {}).get("Name", "")),
        "readOnlyRootFilesystem": host.get("ReadonlyRootfs") is True,
        "privileged": host.get("Privileged") is True,
        "memoryBytes": safe_int(host.get("Memory")),
        "nanoCpus": safe_int(host.get("NanoCpus")),
        "pidsLimit": safe_int(host.get("PidsLimit")),
        "capAdd": cap_add,
        "capAddValid": cap_add_valid,
        "capDrop": cap_drop,
        "capDropValid": cap_drop_valid,
        "securityOptions": security,
        "securityOptionsValid": security_valid,
        "tmpfs": tmpfs,
        "tmpfsValid": tmpfs_valid,
        "networkNames": sorted(str(name) for name in networks),
        "networkAliases": sorted(set(aliases)),
        "networkAliasesValid": aliases_valid,
        "hostPorts": sorted(host_ports),
        "portBindingsValid": bindings_valid,
        "exposedPorts": sorted(str(key) for key in exposed),
        "mounts": mounts,
        "mountsValid": mounts_valid,
    }


def compare(role: str, actual: dict[str, Any], expected: dict[str, Any]) -> list[dict[str, Any]]:
    mismatches: list[dict[str, Any]] = []

    def bounded(value: Any) -> Any:
        encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
        if len(encoded) <= 512:
            return value
        return {"truncated": True, "sizeBytes": len(encoded), "sha256": hashlib.sha256(encoded).hexdigest()}

    def check(field: str, expected_value: Any, actual_value: Any, code: str) -> None:
        if actual_value != expected_value and len(mismatches) < MAX_MISMATCHES:
            mismatches.append({"code": code, "field": f"{role}.{field}", "expected": bounded(expected_value), "actual": bounded(actual_value)})

    check("name", expected["name"], actual["name"], "container_name_mismatch")
    check("image", expected["image"], actual["image"], "container_image_mismatch")
    check("running", True, actual["running"], "container_running_mismatch")
    check("health", "healthy", actual["health"], "container_health_mismatch")
    check("composeProject", expected["project"], actual["composeProject"], "compose_project_mismatch")
    check("composeService", expected["service"], actual["composeService"], "compose_service_mismatch")
    check("composeContainerNumber", "1", actual["composeContainerNumber"], "compose_container_number_mismatch")
    check("composeOneoff", "False", actual["composeOneoff"], "compose_oneoff_mismatch")
    extra_labels = sorted(set(actual["composeLabelKeys"]) - ALLOWED_COMPOSE_LABEL_KEYS)
    check("unexpectedComposeLabelKeys", [], extra_labels, "compose_label_key_mismatch")
    check("restartPolicy", "unless-stopped", actual["restartPolicy"], "restart_policy_mismatch")
    check("readOnlyRootFilesystem", True, actual["readOnlyRootFilesystem"], "read_only_rootfs_mismatch")
    check("privileged", False, actual["privileged"], "privileged_mode_mismatch")
    check("memoryBytes", expected["memoryBytes"], actual["memoryBytes"], "memory_limit_mismatch")
    check("nanoCpus", expected["nanoCpus"], actual["nanoCpus"], "cpu_limit_mismatch")
    check("pidsLimit", expected["pidsLimit"], actual["pidsLimit"], "pids_limit_mismatch")
    check("capAddValid", True, actual["capAddValid"], "cap_add_invalid")
    check("capAdd", expected["capAdd"], actual["capAdd"], "cap_add_mismatch")
    check("capDropValid", True, actual["capDropValid"], "cap_drop_invalid")
    check("capDrop", expected["capDrop"], actual["capDrop"], "cap_drop_mismatch")
    check("securityOptionsValid", True, actual["securityOptionsValid"], "security_options_invalid")
    check("securityOptions", expected["securityOptions"], actual["securityOptions"], "security_options_mismatch")
    check("tmpfsValid", True, actual["tmpfsValid"], "tmpfs_mismatch")
    check("networkNames", expected["networkNames"], actual["networkNames"], "network_names_mismatch")
    check("networkAliasesValid", True, actual["networkAliasesValid"], "network_aliases_invalid")
    check("networkAliases", expected["networkAliases"], actual["networkAliases"], "network_aliases_mismatch")
    check("portBindingsValid", True, actual["portBindingsValid"], "port_bindings_invalid")
    check("hostPorts", expected["hostPorts"], actual["hostPorts"], "host_ports_mismatch")
    check("exposedPorts", expected["exposedPorts"], actual["exposedPorts"], "exposed_ports_mismatch")
    check("mountsValid", True, actual["mountsValid"], "mounts_invalid")
    check("mounts", expected["mounts"], actual["mounts"], "mounts_mismatch")
    return mismatches


def validate(application: Any, edge: Any) -> dict[str, Any]:
    projections = {
        "application": project_container(one_container(application)),
        "edge": project_container(one_container(edge)),
    }
    mismatches = compare("application", projections["application"], EXPECTED["application"])
    mismatches.extend(compare("edge", projections["edge"], EXPECTED["edge"]))
    mismatches = mismatches[:MAX_MISMATCHES]
    return {
        "schemaVersion": SCHEMA_VERSION,
        "profile": PROFILE,
        "status": "verified" if not mismatches else "mismatch",
        "ok": not mismatches,
        "mismatchCount": len(mismatches),
        "mismatches": mismatches,
        "normalization": {
            "capabilityPrefixes": "optional_CAP_prefix_removed",
            "securityOptionSeparators": "equals_and_colon_equivalent",
            "tmpfsSize": "binary_units_normalized_to_bytes",
        },
    }


def emit(payload: dict[str, Any], stream: Any = sys.stdout) -> None:
    bounded = dict(payload)
    encoded = json.dumps(bounded, sort_keys=True, separators=(",", ":"))
    if len(encoded.encode("utf-8")) + 1 > MAX_OUTPUT_BYTES:
        source = list(bounded.get("mismatches", []))
        bounded["mismatches"] = []
        bounded["reportedMismatchCount"] = 0
        bounded["mismatchesTruncated"] = True
        for mismatch in source:
            candidate = list(bounded["mismatches"])
            candidate.append(mismatch)
            bounded["mismatches"] = candidate
            bounded["reportedMismatchCount"] = len(candidate)
            candidate_encoded = json.dumps(bounded, sort_keys=True, separators=(",", ":"))
            if len(candidate_encoded.encode("utf-8")) + 1 > MAX_OUTPUT_BYTES:
                bounded["mismatches"] = candidate[:-1]
                bounded["reportedMismatchCount"] = len(candidate) - 1
                break
        encoded = json.dumps(bounded, sort_keys=True, separators=(",", ":"))
    if len(encoded.encode("utf-8")) + 1 > MAX_OUTPUT_BYTES:
        encoded = json.dumps({
            "schemaVersion": SCHEMA_VERSION,
            "profile": PROFILE,
            "status": "mismatch",
            "ok": False,
            "reason": "bounded_output_reduced",
            "mismatchCount": payload.get("mismatchCount"),
            "reportedMismatchCount": 0,
            "mismatchesTruncated": True,
            "mismatches": [],
        }, sort_keys=True, separators=(",", ":"))
    print(encoded, file=stream, flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--application", type=Path)
    parser.add_argument("--edge", type=Path)
    parser.add_argument("--fixture", type=Path)
    parser.add_argument("--help", action="help")
    args = parser.parse_args()
    if bool(args.fixture) == bool(args.application or args.edge):
        parser.error("use either --fixture or both --application and --edge")
    if not args.fixture and not (args.application and args.edge):
        parser.error("both --application and --edge are required")
    return args


def main() -> int:
    try:
        args = parse_args()
        if args.fixture:
            fixture = read_json_file(args.fixture)
            if not isinstance(fixture, dict) or set(fixture) != {"application", "edge"}:
                raise InputError("fixture_shape_invalid")
            result = validate(fixture["application"], fixture["edge"])
        else:
            result = validate(read_json_file(args.application), read_json_file(args.edge))
        emit(result)
        return 0 if result["ok"] else 70
    except InputError as error:
        emit({"schemaVersion": SCHEMA_VERSION, "profile": PROFILE, "status": "invalid_input", "ok": False, "reason": str(error)}, stream=sys.stderr)
        return 64


if __name__ == "__main__":
    raise SystemExit(main())
