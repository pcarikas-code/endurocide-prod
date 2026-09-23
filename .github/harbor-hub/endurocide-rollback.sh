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

stop() {
  local reason="$1"
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
for host in pilot.nca.co.za nca.co.za www.nca.co.za; do
  [[ "$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --resolve "${host}:443:127.0.0.1" --max-time 15 "https://${host}/")" == "200" ]] || stop "nca_local_https_preflight_failed"
done

docker compose --project-name "$PROJECT" --file "$COMPOSE" stop "$SERVICE"
docker compose --project-name "$PROJECT" --file "$COMPOSE" rm -f "$SERVICE"
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
printf '{"status":"rolled_back_to_undeployed","application":"endurocide","commitSha":"%s","containerPresent":false,"currentReleaseLinked":false,"imageRetained":true,"releaseEvidenceRetained":true,"ncaNonInterferenceVerified":true,"caddyChanged":false,"dnsChanged":false,"monitoringChanged":false,"databaseChanged":false,"pleskChanged":false}\n' "$COMMIT"
