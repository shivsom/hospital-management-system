#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Hospital Management System — VPS Deployment Script
# Tested on: Ubuntu 22.04 / 24.04 LTS
# Usage:  chmod +x deploy-vps.sh && sudo ./deploy-vps.sh
# ─────────────────────────────────────────────────────────────
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/YOUR_USERNAME/hospital-management-system.git}"
APP_DIR="/opt/hms"
COMPOSE_VERSION="2.27.0"

log()  { echo -e "\033[1;32m[INFO]\033[0m  $*"; }
warn() { echo -e "\033[1;33m[WARN]\033[0m  $*"; }
die()  { echo -e "\033[1;31m[ERROR]\033[0m $*" >&2; exit 1; }

# ── 1. System update ─────────────────────────────────────────
log "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

# ── 2. Install Docker ─────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  log "Installing Docker..."
  apt-get install -y -qq ca-certificates curl gnupg

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable docker
  systemctl start docker
  log "Docker installed: $(docker --version)"
else
  log "Docker already installed: $(docker --version)"
fi

# ── 3. Add current user to docker group (if not root) ─────────
if [[ "$EUID" -ne 0 ]]; then
  usermod -aG docker "$USER"
  warn "Added $USER to docker group. Re-login or run: newgrp docker"
fi

# ── 4. Configure firewall ─────────────────────────────────────
if command -v ufw &>/dev/null; then
  log "Configuring UFW firewall..."
  ufw allow 22/tcp   comment "SSH"
  ufw allow 80/tcp   comment "HTTP"
  ufw allow 443/tcp  comment "HTTPS"
  ufw --force enable
  ufw status
fi

# ── 5. Clone or update repository ─────────────────────────────
if [[ -d "$APP_DIR/.git" ]]; then
  log "Repository exists — pulling latest changes..."
  cd "$APP_DIR"
  git pull origin main
else
  log "Cloning repository to $APP_DIR..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# ── 6. Validate .env file ─────────────────────────────────────
if [[ ! -f "$APP_DIR/.env" ]]; then
  warn ".env file not found. Copying .env.example..."
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  die "Please edit $APP_DIR/.env with real credentials, then re-run this script."
fi

log ".env file found ✓"

# ── 7. Generate JWT secret if placeholder still present ───────
if grep -q "REPLACE_WITH" "$APP_DIR/.env"; then
  log "Generating secure JWT secret..."
  NEW_SECRET=$(openssl rand -base64 64 | tr -d '\n')
  sed -i "s|REPLACE_WITH_BASE64_SECRET_MIN_512_BITS|${NEW_SECRET}|g" "$APP_DIR/.env"
  log "JWT secret generated and written to .env"
fi

# ── 8. Pull images and start services ─────────────────────────
log "Starting HMS with Docker Compose..."
cd "$APP_DIR"
docker compose pull --quiet 2>/dev/null || true
docker compose up -d --build --remove-orphans

# ── 9. Wait for health checks ─────────────────────────────────
log "Waiting for services to become healthy (up to 3 minutes)..."
TIMEOUT=180
ELAPSED=0
while [[ $ELAPSED -lt $TIMEOUT ]]; do
  UNHEALTHY=$(docker compose ps --format json 2>/dev/null \
    | python3 -c "
import sys, json
lines = sys.stdin.read().strip().split('\n')
count = sum(1 for l in lines if l and json.loads(l).get('Health','') not in ('healthy',''))
print(count)
" 2>/dev/null || echo "0")

  if [[ "$UNHEALTHY" == "0" ]]; then
    break
  fi
  sleep 10
  ELAPSED=$((ELAPSED + 10))
  log "Still waiting... ${ELAPSED}s elapsed"
done

# ── 10. Status report ─────────────────────────────────────────
log "=== Service Status ==="
docker compose ps

log "=== Recent Logs (last 20 lines each) ==="
docker compose logs --tail=20

log ""
log "✅ HMS deployment complete!"
log "   App URL:    http://$(curl -s ifconfig.me)"
log "   Logs:       docker compose -f $APP_DIR/docker-compose.yml logs -f"
log "   Status:     docker compose -f $APP_DIR/docker-compose.yml ps"
log "   Stop:       docker compose -f $APP_DIR/docker-compose.yml down"
