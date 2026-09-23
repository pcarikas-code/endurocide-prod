#!/usr/bin/env bash
set -euo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export LANG=C
umask 077

[[ "${EUID}" -eq 0 ]] || { echo '{"status":"stopped","reason":"root_required"}'; exit 1; }
[[ "$#" -eq 1 ]] || { echo '{"status":"stopped","reason":"bundle_directory_required"}'; exit 1; }

COMMIT="4eca0ac71699e45209fd8d51901d151c9a747893"
IMAGE="endurocide:${COMMIT}"
PROJECT="harbor-endurocide"
SERVICE="endurocide-origin"
CONTAINER="endurocide-origin"
NETWORK="harbor-edge"
NCA_APP="nca-pilot-nca-site-1"
NCA_EDGE="nca-edge"
NCA_IMAGE="nca-website:9ba586d54d463004328b2235daae6de3ec9a2ef9"
CADDY_IMAGE="caddy@sha256:d8c17a862962def15cde69863a3a463f25a2664942eafd7bdbf050e9c3116b83"
NCA_LOCK="/var/lock/harbor-hub-nca-deploy.lock"
OWN_LOCK="/var/lock/harbor-hub-endurocide-deploy.lock"
CADDYFILE="/opt/harbor-hub/edge/nca-pilot/Caddyfile"
NCA_RELEASE="/opt/harbor-hub/tenants/nca/releases/9ba586d54d463004328b2235daae6de3ec9a2ef9/compose.yaml"
TENANT_ROOT="/opt/harbor-hub/tenants/endurocide"
RELEASE="${TENANT_ROOT}/releases/${COMMIT}"
CURRENT="${TENANT_ROOT}/current"
INCOMING_DIR="$1"
[[ "$INCOMING_DIR" =~ ^/home/harbor-deploy/incoming/[0-9]{1,32}$ ]] || { echo '{"status":"stopped","reason":"invalid_bundle_directory"}'; exit 1; }
INCOMING_ARCHIVE="${INCOMING_DIR}/endurocide-image.tar.gz"
INCOMING_MANIFEST="${INCOMING_DIR}/deployment-manifest.json"
ARCHIVE=""
MANIFEST=""
bundle_stage=""
started=0
current_linked=0

stop() {
  local reason="$1"
  printf '{"status":"stopped","reason":"%s"}\n' "$reason"
  exit 1
}

secure_regular_file() {
  local path="$1"
  [[ -f "$path" && ! -L "$path" ]] || stop "invalid_bundle_file"
  local mode
  mode="$(stat -c '%a' "$path")"
  (( (8#$mode & 0022) == 0 )) || stop "writable_bundle_file"
}

secure_existing_lock() {
  local path="$1"
  [[ -f "$path" && ! -L "$path" ]] || stop "missing_shared_lock"
  [[ "$(stat -c '%u:%g:%a' "$path")" == "0:0:600" ]] || stop "insecure_shared_lock"
}

cleanup() {
  local rc=$?
  trap - EXIT HUP INT TERM
  if (( rc != 0 && started == 1 )); then
    docker compose --project-name "$PROJECT" --file "${RELEASE}/compose.yaml" stop "$SERVICE" >/dev/null 2>&1 || true
    docker compose --project-name "$PROJECT" --file "${RELEASE}/compose.yaml" rm -f "$SERVICE" >/dev/null 2>&1 || true
    if (( current_linked == 1 )) && [[ -L "$CURRENT" ]] && [[ "$(readlink -f "$CURRENT")" == "$RELEASE" ]]; then
      rm -f -- "$CURRENT"
    fi
  fi
  if [[ -n "$bundle_stage" && -d "$bundle_stage" ]]; then
    rm -rf -- "$bundle_stage"
  fi
  exit "$rc"
}
trap cleanup EXIT HUP INT TERM

secure_existing_lock "$NCA_LOCK"
exec 9<>"$NCA_LOCK"
flock -n 9 || stop "nca_deployment_lock_busy"
if [[ ! -e "$OWN_LOCK" && ! -L "$OWN_LOCK" ]]; then
  ( set -o noclobber; : >"$OWN_LOCK" ) || stop "endurocide_lock_create_failed"
  chown root:root "$OWN_LOCK"
  chmod 600 "$OWN_LOCK"
fi
secure_existing_lock "$OWN_LOCK"
exec 8<>"$OWN_LOCK"
flock -n 8 || stop "endurocide_deployment_lock_busy"

systemctl is-active --quiet docker || stop "docker_inactive"
if systemctl list-unit-files --type=service | grep -q '^amazon-ssm-agent\.service'; then
  systemctl is-active --quiet amazon-ssm-agent || stop "ssm_agent_inactive"
elif command -v snap >/dev/null 2>&1; then
  [[ "$(snap services amazon-ssm-agent 2>/dev/null | awk 'NR==2 {print $3}')" == "active" ]] || stop "ssm_agent_inactive"
else
  stop "ssm_agent_unavailable"
fi

docker network inspect "$NETWORK" >/dev/null || stop "private_network_missing"
secure_regular_file "$CADDYFILE"
secure_regular_file "$NCA_RELEASE"
[[ -d "$INCOMING_DIR" && ! -L "$INCOMING_DIR" ]] || stop "invalid_bundle_directory"
[[ "$(stat -c '%U:%G:%a' "$INCOMING_DIR")" == "harbor-deploy:harbor-deploy:700" ]] || stop "insecure_bundle_directory"
secure_regular_file "$INCOMING_ARCHIVE"
secure_regular_file "$INCOMING_MANIFEST"

[[ ! -e "$CURRENT" && ! -L "$CURRENT" ]] || stop "current_release_exists"
[[ ! -e "$RELEASE" && ! -L "$RELEASE" ]] || stop "release_directory_exists"
[[ -z "$(docker ps -aq --filter label=com.docker.compose.project="$PROJECT")" ]] || stop "endurocide_project_exists"
[[ -z "$(docker ps -aq --filter name='^/endurocide-origin$')" ]] || stop "endurocide_container_exists"
[[ -z "$(docker image ls -q "$IMAGE")" ]] || stop "endurocide_image_exists"

running_before="$(docker ps --format '{{.Names}}' | sort)"
[[ "$running_before" == $'nca-edge\nnca-pilot-nca-site-1' ]] || stop "unexpected_running_container_inventory"
[[ "$(docker inspect --format '{{.State.Status}}:{{.State.Health.Status}}' "$NCA_APP")" == "running:healthy" ]] || stop "nca_application_unhealthy"
[[ "$(docker inspect --format '{{.State.Status}}:{{.State.Health.Status}}' "$NCA_EDGE")" == "running:healthy" ]] || stop "nca_edge_unhealthy"
[[ "$(docker inspect --format '{{.Config.Image}}' "$NCA_APP")" == "$NCA_IMAGE" ]] || stop "nca_application_image_mismatch"
[[ "$(docker inspect --format '{{.Config.Image}}' "$NCA_EDGE")" == "$CADDY_IMAGE" ]] || stop "nca_edge_image_mismatch"

nca_app_id="$(docker inspect --format '{{.Id}}' "$NCA_APP")"
nca_edge_id="$(docker inspect --format '{{.Id}}' "$NCA_EDGE")"
caddyfile_sha="$(sha256sum "$CADDYFILE" | cut -d' ' -f1)"
active_caddy_sha="$(docker exec "$NCA_EDGE" caddy adapt --config /etc/caddy/Caddyfile --pretty 2>/dev/null | sha256sum | cut -d' ' -f1)"
for host in pilot.nca.co.za nca.co.za www.nca.co.za; do
  [[ "$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --resolve "${host}:443:127.0.0.1" --max-time 15 "https://${host}/")" == "200" ]] || stop "nca_local_https_preflight_failed"
done

install -d -m 0700 -o root -g root /opt/harbor-hub/staging
bundle_stage="$(mktemp -d /opt/harbor-hub/staging/endurocide-upload.XXXXXX)"
chmod 0700 "$bundle_stage"
cp --reflink=never -- "$INCOMING_ARCHIVE" "${bundle_stage}/endurocide-image.tar.gz"
cp --reflink=never -- "$INCOMING_MANIFEST" "${bundle_stage}/deployment-manifest.json"
chown root:root "${bundle_stage}/endurocide-image.tar.gz" "${bundle_stage}/deployment-manifest.json"
chmod 0400 "${bundle_stage}/endurocide-image.tar.gz" "${bundle_stage}/deployment-manifest.json"
ARCHIVE="${bundle_stage}/endurocide-image.tar.gz"
MANIFEST="${bundle_stage}/deployment-manifest.json"

manifest_values="$(python3 - "$MANIFEST" "$ARCHIVE" "$COMMIT" <<'PY'
import json
import pathlib
import re
import sys
manifest_path, archive_path, commit = sys.argv[1:]
manifest_file = pathlib.Path(manifest_path)
archive_file = pathlib.Path(archive_path)
if manifest_file.stat().st_size > 8192:
    raise SystemExit("manifest_too_large")
data = json.loads(manifest_file.read_text(encoding="utf-8"))
expected = {
    "schemaVersion": 1,
    "application": "endurocide",
    "repository": "pcarikas-code/endurocide-prod",
    "branch": "main",
    "commitSha": commit,
    "image": f"endurocide:{commit}",
    "platform": "linux/amd64",
    "archiveFormat": "docker-image-tar+gzip",
    "healthPath": "/api/health",
    "artifactSizeBytes": archive_file.stat().st_size,
}
for key, value in expected.items():
    if data.get(key) != value:
        raise SystemExit(f"manifest_mismatch_{key}")
digest = data.get("artifactSha256")
workflow = data.get("workflowCommitSha")
if not isinstance(digest, str) or re.fullmatch(r"[a-f0-9]{64}", digest) is None:
    raise SystemExit("invalid_artifact_digest")
if not isinstance(workflow, str) or re.fullmatch(r"[a-f0-9]{40}", workflow) is None:
    raise SystemExit("invalid_workflow_commit")
print(digest)
print(workflow)
PY
)" || stop "manifest_validation_failed"
artifact_sha="$(printf '%s\n' "$manifest_values" | sed -n '1p')"
workflow_sha="$(printf '%s\n' "$manifest_values" | sed -n '2p')"
[[ "$(sha256sum "$ARCHIVE" | cut -d' ' -f1)" == "$artifact_sha" ]] || stop "archive_checksum_mismatch"
gzip -t "$ARCHIVE" || stop "invalid_image_archive"

gzip -dc "$ARCHIVE" >"${bundle_stage}/endurocide-image.tar"
docker load --input "${bundle_stage}/endurocide-image.tar" >/dev/null
docker image inspect "$IMAGE" >/dev/null || stop "exact_image_missing_after_load"
[[ "$(docker image inspect --format '{{.Config.User}}' "$IMAGE")" == "node" ]] || stop "image_user_mismatch"
[[ "$(docker image inspect --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' "$IMAGE")" == "$COMMIT" ]] || stop "image_commit_label_mismatch"
[[ "$(docker image inspect --format '{{ index .Config.Labels "io.harbor-hub.workflow-sha" }}' "$IMAGE")" == "$workflow_sha" ]] || stop "image_workflow_label_mismatch"

install -d -m 0750 -o root -g docker "$RELEASE"
cat >"${RELEASE}/compose.yaml.tmp" <<EOF
name: ${PROJECT}
services:
  ${SERVICE}:
    container_name: ${CONTAINER}
    image: ${IMAGE}
    user: "1000:1000"
    restart: unless-stopped
    expose:
      - "3000"
    networks:
      ${NETWORK}:
        aliases:
          - ${CONTAINER}
    read_only: true
    tmpfs:
      - /tmp:size=32m,mode=1777
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    pids_limit: 100
    mem_limit: 384m
    cpus: 0.50
    stop_grace_period: 20s
networks:
  ${NETWORK}:
    external: true
    name: ${NETWORK}
EOF
chmod 0640 "${RELEASE}/compose.yaml.tmp"
chown root:docker "${RELEASE}/compose.yaml.tmp"
mv "${RELEASE}/compose.yaml.tmp" "${RELEASE}/compose.yaml"
cp "$MANIFEST" "${RELEASE}/deployment-manifest.json.tmp"
chmod 0640 "${RELEASE}/deployment-manifest.json.tmp"
chown root:docker "${RELEASE}/deployment-manifest.json.tmp"
mv "${RELEASE}/deployment-manifest.json.tmp" "${RELEASE}/deployment-manifest.json"
rm -rf -- "$bundle_stage"
bundle_stage=""

started=1
docker compose --project-name "$PROJECT" --file "${RELEASE}/compose.yaml" up -d --no-build --wait "$SERVICE"
[[ "$(docker inspect --format '{{.State.Status}}:{{.State.Health.Status}}' "$CONTAINER")" == "running:healthy" ]] || stop "endurocide_unhealthy"

python3 - "$CONTAINER" "$IMAGE" "$NETWORK" <<'PY'
import json
import subprocess
import sys
container, image, network = sys.argv[1:]
data = json.loads(subprocess.check_output(["docker", "inspect", container], text=True))[0]
host = data["HostConfig"]
config = data["Config"]
state = data["State"]
networks = data["NetworkSettings"]["Networks"]
checks = {
    "image": config.get("Image") == image,
    "user": config.get("User") == "1000:1000",
    "healthy": state.get("Status") == "running" and state.get("Health", {}).get("Status") == "healthy",
    "readOnly": host.get("ReadonlyRootfs") is True,
    "privileged": host.get("Privileged") is False,
    "ports": host.get("PortBindings") in (None, {}),
    "capDrop": sorted(host.get("CapDrop") or []) == ["ALL"],
    "capAdd": (host.get("CapAdd") or []) == [],
    "security": sorted(host.get("SecurityOpt") or []) == ["no-new-privileges:true"],
    "memory": host.get("Memory") == 402653184,
    "cpu": host.get("NanoCpus") == 500000000,
    "pids": host.get("PidsLimit") == 100,
    "restart": host.get("RestartPolicy", {}).get("Name") == "unless-stopped",
    "network": sorted(networks) == [network],
    "alias": container in (networks.get(network, {}).get("Aliases") or []),
}
tmpfs = host.get("Tmpfs") or {}
tokens = sorted((tmpfs.get("/tmp") or "").replace("rw,", "").split(","))
checks["tmpfs"] = tokens == ["mode=1777", "size=33554432"]
if not all(checks.values()):
    raise SystemExit("container_boundary_mismatch")
PY

docker exec -i "$CONTAINER" node - <<'NODE'
const http = require('http');
const paths = ['/api/health', '/'];
let pending = paths.length;
let failed = false;
for (const path of paths) {
  const req = http.get({ host: '127.0.0.1', port: 3000, path, timeout: 5000 }, response => {
    let bytes = 0;
    response.on('data', chunk => { bytes += chunk.length; if (bytes > 1048576) response.destroy(); });
    response.on('end', () => {
      if (response.statusCode !== 200 || (path === '/' && bytes === 0)) failed = true;
      if (--pending === 0) process.exit(failed ? 1 : 0);
    });
  });
  req.on('timeout', () => req.destroy(new Error('timeout')));
  req.on('error', () => { failed = true; if (--pending === 0) process.exit(1); });
}
NODE

running_after="$(docker ps --format '{{.Names}}' | sort)"
[[ "$running_after" == $'endurocide-origin\nnca-edge\nnca-pilot-nca-site-1' ]] || stop "unexpected_post_deployment_inventory"
[[ "$(docker inspect --format '{{.Id}}' "$NCA_APP")" == "$nca_app_id" ]] || stop "nca_application_identity_changed"
[[ "$(docker inspect --format '{{.Id}}' "$NCA_EDGE")" == "$nca_edge_id" ]] || stop "nca_edge_identity_changed"
[[ "$(sha256sum "$CADDYFILE" | cut -d' ' -f1)" == "$caddyfile_sha" ]] || stop "caddyfile_changed"
[[ "$(docker exec "$NCA_EDGE" caddy adapt --config /etc/caddy/Caddyfile --pretty 2>/dev/null | sha256sum | cut -d' ' -f1)" == "$active_caddy_sha" ]] || stop "active_caddy_changed"
for host in pilot.nca.co.za nca.co.za www.nca.co.za; do
  [[ "$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --resolve "${host}:443:127.0.0.1" --max-time 15 "https://${host}/")" == "200" ]] || stop "nca_local_https_postcheck_failed"
done

ln -s "$RELEASE" "${CURRENT}.tmp"
mv -T "${CURRENT}.tmp" "$CURRENT"
current_linked=1
python3 - "$RELEASE" "$COMMIT" "$artifact_sha" "$workflow_sha" <<'PY'
import datetime
import json
import pathlib
import sys
release, commit, digest, workflow = sys.argv[1:]
evidence = {
    "schemaVersion": 1,
    "status": "verified",
    "application": "endurocide",
    "commitSha": commit,
    "artifactSha256": digest,
    "workflowCommitSha": workflow,
    "containerHealthy": True,
    "privateNetwork": "harbor-edge",
    "publishedHostPorts": False,
    "ncaNonInterferenceVerified": True,
    "caddyChanged": False,
    "dnsChanged": False,
    "monitoringChanged": False,
    "databaseChanged": False,
    "pleskChanged": False,
    "completedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
}
path = pathlib.Path(release) / "deployment-evidence.json"
tmp = path.with_suffix(".json.tmp")
tmp.write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
tmp.chmod(0o640)
tmp.replace(path)
PY
chown root:docker "${RELEASE}/deployment-evidence.json"

trap - EXIT HUP INT TERM
printf '{"status":"verified","application":"endurocide","commitSha":"%s","containerHealthy":true,"privateNetwork":"harbor-edge","publishedHostPorts":false,"ncaNonInterferenceVerified":true,"caddyChanged":false,"dnsChanged":false,"monitoringChanged":false,"databaseChanged":false,"pleskChanged":false}\n' "$COMMIT"
