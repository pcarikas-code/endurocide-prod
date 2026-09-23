#!/usr/bin/env bash
set -euo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export LANG=C
umask 077

[[ "${EUID}" -eq 0 ]] || { echo '{"status":"stopped","reason":"root_required"}'; exit 1; }

COMMIT="4eca0ac71699e45209fd8d51901d151c9a747893"
PROJECT="harbor-endurocide"
SERVICE="endurocide-origin"
CONTAINER="endurocide-origin"
NCA_APP="nca-pilot-nca-site-1"
NCA_EDGE="nca-edge"
NCA_IMAGE="nca-website:9ba586d54d463004328b2235daae6de3ec9a2ef9"
CADDY_IMAGE="caddy@sha256:d8c17a862962def15cde69863a3a463f25a2664942eafd7bdbf050e9c3116b83"
NCA_LOCK="/var/lock/harbor-hub-nca-deploy.lock"
OWN_LOCK="/var/lock/harbor-hub-endurocide-deploy.lock"
CADDYFILE="/opt/harbor-hub/edge/nca-pilot/Caddyfile"
RELEASE="/opt/harbor-hub/tenants/endurocide/releases/${COMMIT}"
CURRENT="/opt/harbor-hub/tenants/endurocide/current"
COMPOSE="${RELEASE}/compose.yaml"
failure_reason="command_failed"
mutation_attempted=0
baseline_ready=0
rollback_success=0

stop() {
  local reason="$1"
  failure_reason="$reason"
  printf '{"status":"stopped","reason":"%s"}\n' "$reason"
  exit 1
}

secure_regular_file() {
  local path="$1"
  [[ -f "$path" && ! -L "$path" ]] || stop "required_file_missing_or_unsafe"
  local mode
  mode="$(stat -c '%a' "$path")"
  (( (8#$mode & 0022) == 0 )) || stop "required_file_writable"
}

cleanup() {
  local rc=$?
  local cleanup_failed=0
  local container_present=false
  local current_linked=false
  trap - EXIT HUP INT TERM
  set +e
  if (( rc != 0 && mutation_attempted == 1 )); then
    if [[ -n "$(docker ps -aq --filter name='^/endurocide-origin$' 2>/dev/null)" ]]; then
      docker rm -f "$CONTAINER" >/dev/null 2>&1 || cleanup_failed=1
    fi
    if [[ -L "$CURRENT" ]] && [[ "$(readlink -f "$CURRENT" 2>/dev/null)" == "$RELEASE" ]]; then
      rm -f -- "$CURRENT" || cleanup_failed=1
    fi
    [[ -z "$(docker ps -aq --filter label=com.docker.compose.project="$PROJECT" 2>/dev/null)" ]] || cleanup_failed=1
    [[ -z "$(docker ps -aq --filter name='^/endurocide-origin$' 2>/dev/null)" ]] || { cleanup_failed=1; container_present=true; }
    [[ ! -e "$CURRENT" && ! -L "$CURRENT" ]] || { cleanup_failed=1; current_linked=true; }
    if (( baseline_ready == 1 )); then
      [[ "$(docker ps --format '{{.Names}}' 2>/dev/null | sort)" == $'nca-edge\nnca-pilot-nca-site-1' ]] || cleanup_failed=1
      [[ "$(docker inspect --format '{{.Id}}' "$NCA_APP" 2>/dev/null)" == "$nca_app_id" ]] || cleanup_failed=1
      [[ "$(docker inspect --format '{{.Id}}' "$NCA_EDGE" 2>/dev/null)" == "$nca_edge_id" ]] || cleanup_failed=1
      [[ "$(sha256sum "$CADDYFILE" 2>/dev/null | cut -d' ' -f1)" == "$caddyfile_sha" ]] || cleanup_failed=1
      [[ "$(docker exec "$NCA_EDGE" caddy adapt --config /etc/caddy/Caddyfile --pretty 2>/dev/null | sha256sum | cut -d' ' -f1)" == "$active_caddy_sha" ]] || cleanup_failed=1
      for host in pilot.nca.co.za nca.co.za www.nca.co.za; do
        [[ "$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --resolve "${host}:443:127.0.0.1" --max-time 15 "https://${host}/" 2>/dev/null)" == "200" ]] || cleanup_failed=1
      done
    fi
    if [[ -d "$RELEASE" && ! -L "$RELEASE" ]]; then
      python3 - "$RELEASE" "$COMMIT" "$failure_reason" "$cleanup_failed" "$container_present" "$current_linked" <<'PY' || cleanup_failed=1
import datetime
import json
import pathlib
import sys
release, commit, reason, cleanup_failed, container_present, current_linked = sys.argv[1:]
incomplete = cleanup_failed != "0"
evidence = {
    "schemaVersion": 1,
    "status": "cleanup_incomplete" if incomplete else "cleaned_after_failure",
    "manualReviewRequired": incomplete,
    "reason": reason,
    "application": "endurocide",
    "commitSha": commit,
    "containerPresent": container_present == "true",
    "currentReleaseLinked": current_linked == "true",
    "imageRetained": True,
    "releaseEvidenceRetained": True,
    "completedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
}
path = pathlib.Path(release) / "rollback-failure-evidence.json"
temporary = path.with_suffix(".json.tmp")
temporary.write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
temporary.chmod(0o640)
temporary.replace(path)
PY
      chown root:docker "${RELEASE}/rollback-failure-evidence.json" >/dev/null 2>&1 || cleanup_failed=1
    else
      cleanup_failed=1
    fi
    if (( cleanup_failed != 0 )); then
      printf '{"status":"cleanup_incomplete","reason":"%s","manualReviewRequired":true,"containerPresent":%s,"currentReleaseLinked":%s}\n' "$failure_reason" "$container_present" "$current_linked" >&2
      exit 70
    fi
    printf '{"status":"cleaned_after_failure","reason":"%s","manualReviewRequired":false,"containerPresent":false,"currentReleaseLinked":false}\n' "$failure_reason" >&2
  fi
  exit "$rc"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

for path in "$NCA_LOCK" "$OWN_LOCK"; do
  [[ -f "$path" && ! -L "$path" ]] || stop "required_lock_missing"
  [[ "$(stat -c '%u:%g:%a' "$path")" == "0:0:600" ]] || stop "required_lock_insecure"
done
exec 9<>"$NCA_LOCK"
flock -n 9 || stop "nca_deployment_lock_busy"
exec 8<>"$OWN_LOCK"
flock -n 8 || stop "endurocide_deployment_lock_busy"

secure_regular_file "$CADDYFILE"
secure_regular_file "$COMPOSE"
[[ -L "$CURRENT" && "$(readlink -f "$CURRENT")" == "$RELEASE" ]] || stop "current_release_mismatch"
[[ "$(docker ps --format '{{.Names}}' | sort)" == $'endurocide-origin\nnca-edge\nnca-pilot-nca-site-1' ]] || stop "unexpected_running_container_inventory"
[[ "$(docker inspect --format '{{.State.Status}}:{{.State.Health.Status}}' "$NCA_APP")" == "running:healthy" ]] || stop "nca_application_unhealthy"
[[ "$(docker inspect --format '{{.State.Status}}:{{.State.Health.Status}}' "$NCA_EDGE")" == "running:healthy" ]] || stop "nca_edge_unhealthy"
[[ "$(docker inspect --format '{{.Config.Image}}' "$NCA_APP")" == "$NCA_IMAGE" ]] || stop "nca_application_image_mismatch"
[[ "$(docker inspect --format '{{.Config.Image}}' "$NCA_EDGE")" == "$CADDY_IMAGE" ]] || stop "nca_edge_image_mismatch"

nca_app_id="$(docker inspect --format '{{.Id}}' "$NCA_APP")"
nca_edge_id="$(docker inspect --format '{{.Id}}' "$NCA_EDGE")"
caddyfile_sha="$(sha256sum "$CADDYFILE" | cut -d' ' -f1)"
active_caddy_sha="$(docker exec "$NCA_EDGE" caddy adapt --config /etc/caddy/Caddyfile --pretty 2>/dev/null | sha256sum | cut -d' ' -f1)"
baseline_ready=1
for host in pilot.nca.co.za nca.co.za www.nca.co.za; do
  [[ "$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --resolve "${host}:443:127.0.0.1" --max-time 15 "https://${host}/")" == "200" ]] || stop "nca_local_https_preflight_failed"
done

mutation_attempted=1
docker compose --project-name "$PROJECT" --file "$COMPOSE" stop "$SERVICE" || stop "rollback_stop_failed"
docker compose --project-name "$PROJECT" --file "$COMPOSE" rm -f "$SERVICE" || stop "rollback_remove_failed"
[[ -z "$(docker ps -aq --filter label=com.docker.compose.project="$PROJECT")" ]] || stop "endurocide_container_remains"
rm -f -- "$CURRENT"

[[ "$(docker ps --format '{{.Names}}' | sort)" == $'nca-edge\nnca-pilot-nca-site-1' ]] || stop "unexpected_post_rollback_inventory"
[[ "$(docker inspect --format '{{.Id}}' "$NCA_APP")" == "$nca_app_id" ]] || stop "nca_application_identity_changed"
[[ "$(docker inspect --format '{{.Id}}' "$NCA_EDGE")" == "$nca_edge_id" ]] || stop "nca_edge_identity_changed"
[[ "$(sha256sum "$CADDYFILE" | cut -d' ' -f1)" == "$caddyfile_sha" ]] || stop "caddyfile_changed"
[[ "$(docker exec "$NCA_EDGE" caddy adapt --config /etc/caddy/Caddyfile --pretty 2>/dev/null | sha256sum | cut -d' ' -f1)" == "$active_caddy_sha" ]] || stop "active_caddy_changed"
for host in pilot.nca.co.za nca.co.za www.nca.co.za; do
  [[ "$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --resolve "${host}:443:127.0.0.1" --max-time 15 "https://${host}/")" == "200" ]] || stop "nca_local_https_postcheck_failed"
done

python3 - "$RELEASE" "$COMMIT" <<'PY'
import datetime
import json
import pathlib
import sys
release, commit = sys.argv[1:]
evidence = {
    "schemaVersion": 1,
    "status": "rolled_back_to_undeployed",
    "application": "endurocide",
    "commitSha": commit,
    "containerPresent": False,
    "currentReleaseLinked": False,
    "imageRetained": True,
    "releaseEvidenceRetained": True,
    "ncaNonInterferenceVerified": True,
    "caddyChanged": False,
    "dnsChanged": False,
    "monitoringChanged": False,
    "databaseChanged": False,
    "pleskChanged": False,
    "completedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
}
path = pathlib.Path(release) / "rollback-evidence.json"
tmp = path.with_suffix(".json.tmp")
tmp.write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
tmp.chmod(0o640)
tmp.replace(path)
PY
chown root:docker "${RELEASE}/rollback-evidence.json"
rollback_success=1
trap - EXIT HUP INT TERM
printf '{"status":"rolled_back_to_undeployed","application":"endurocide","commitSha":"%s","containerPresent":false,"currentReleaseLinked":false,"imageRetained":true,"releaseEvidenceRetained":true,"ncaNonInterferenceVerified":true,"caddyChanged":false,"dnsChanged":false,"monitoringChanged":false,"databaseChanged":false,"pleskChanged":false}\n' "$COMMIT"
