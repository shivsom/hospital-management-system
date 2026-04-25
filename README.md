# 🏥 Hospital Management System — DevOps Guide

## Final Project Structure

```
hospital-management-system/
│
├── .env.example                  ← Copy to .env, fill secrets
├── .gitignore
├── docker-compose.yml            ← Full stack orchestration
│
├── nginx/
│   └── nginx.conf                ← Reverse proxy routing
│
├── backend/                      ← Spring Boot (Java 21)
│   ├── Dockerfile                ← Multi-stage: maven → jre-alpine
│   ├── .dockerignore
│   ├── application.properties    ← Env-var driven, no hardcoded secrets
│   ├── pom.xml
│   └── src/
│
├── frontend/                     ← React 18
│   ├── Dockerfile                ← Multi-stage: node → nginx-alpine
│   ├── .dockerignore
│   ├── nginx-spa.conf            ← SPA fallback routing
│   ├── src/
│   │   └── services/
│   │       └── apiService.js     ← All calls via /api and /ai prefixes
│   └── public/
│
├── ai-microservice/              ← FastAPI + HuggingFace
│   ├── Dockerfile                ← Multi-stage: python-slim
│   ├── .dockerignore
│   ├── main.py                   ← CORS from env var, structured logging
│   └── requirements.txt          ← CPU-only torch (smaller image)
│
├── database/
│   ├── schema.sql
│   └── seed_data.sql
│
├── k8s/                          ← Kubernetes manifests
│   ├── 00-namespace-configmap.yaml
│   ├── 01-secrets.yaml
│   ├── 06-ingress.yaml
│   ├── database/
│   │   └── 02-mysql.yaml
│   ├── backend/
│   │   └── 03-backend.yaml
│   ├── ai/
│   │   └── 04-ai-service.yaml
│   └── frontend/
│       └── 05-frontend.yaml
│
├── scripts/
│   └── deploy-vps.sh             ← One-shot Ubuntu VPS deployment
│
└── .github/
    └── workflows/
        └── ci-cd.yml             ← GitHub Actions CI/CD pipeline
```

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone and configure
git clone https://github.com/YOUR_USERNAME/hospital-management-system.git
cd hospital-management-system
cp .env.example .env
# Edit .env — at minimum set MYSQL_PASSWORD and JWT_SECRET

# 2. Generate a strong JWT secret
openssl rand -base64 64

# 3. Start all services
docker compose up --build

# 4. Access the app
open http://localhost
```

---

## 🌐 Service Routing (nginx reverse proxy)

| URL Path | Service              | Internal Port |
|----------|----------------------|---------------|
| `/`      | React Frontend       | 80            |
| `/api/*` | Spring Boot Backend  | 8081          |
| `/ai/*`  | FastAPI AI Service   | 8000          |

All services communicate on the internal `hms-network` Docker bridge.  
**No service ports are exposed directly** — only nginx port 80 is public.

---

## 🔐 Security Hardening Applied

| Issue (Original)                          | Fix Applied                                      |
|-------------------------------------------|--------------------------------------------------|
| `spring.datasource.password=1234`         | `${SPRING_DATASOURCE_PASSWORD}` from `.env`      |
| `spring.datasource.username=soham`        | `${SPRING_DATASOURCE_USERNAME}` from `.env`      |
| Dev email hardcoded in properties         | Removed; `dev.autologin.enabled=false`           |
| AI CORS hardcoded to `localhost:3000`     | `${AI_CORS_ORIGINS}` env var                     |
| `apiService.js` calls `localhost:8000`    | Routes via nginx `/ai` prefix                    |
| DB port 3306 exposed to host              | Internal only (commented out in compose)         |
| Security debug logging always on          | `WARN` level in production properties            |

---

## 🖥️ Deploy on Ubuntu VPS

```bash
# One-command deployment (installs Docker, clones repo, starts stack)
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/hms/main/scripts/deploy-vps.sh \
  | sudo REPO_URL=https://github.com/YOUR_USERNAME/hms.git bash
```

Or manually:

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER && newgrp docker

# Clone and configure
sudo mkdir -p /opt/hms
sudo git clone https://github.com/YOUR_USERNAME/hms.git /opt/hms
cd /opt/hms
cp .env.example .env
nano .env   # fill in secrets

# Start
docker compose up -d --build

# Monitor
docker compose logs -f
docker compose ps
```

---

## ☸️ Kubernetes Deployment

```bash
# 1. Apply namespace and config
kubectl apply -f k8s/00-namespace-configmap.yaml

# 2. Apply secrets (edit 01-secrets.yaml with real values first, or use:)
kubectl create secret generic hms-secrets --from-env-file=.env -n hms

# 3. Deploy all services in order
kubectl apply -f k8s/database/02-mysql.yaml
kubectl apply -f k8s/backend/03-backend.yaml
kubectl apply -f k8s/ai/04-ai-service.yaml
kubectl apply -f k8s/frontend/05-frontend.yaml
kubectl apply -f k8s/06-ingress.yaml

# 4. Watch rollout
kubectl rollout status deployment/backend -n hms
kubectl get pods -n hms

# 5. Tear down
kubectl delete namespace hms
```

---

## ⚙️ GitHub Actions CI/CD

The pipeline (`.github/workflows/ci-cd.yml`) runs:

1. **Test Backend** — Maven tests on JDK 21
2. **Test Frontend** — `npm test` + `npm run build` on Node 20
3. **Test AI Service** — `flake8` lint on Python 3.11
4. **Build & Push** — Docker images to Docker Hub (main branch only)
5. **Deploy** — SSH into VPS, `git pull`, `docker compose up`

### Required GitHub Secrets

| Secret                | Value                                     |
|-----------------------|-------------------------------------------|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username                  |
| `DOCKER_HUB_TOKEN`    | Docker Hub access token (not password)    |
| `VPS_HOST`            | Your VPS IP address                       |
| `VPS_USER`            | SSH username (e.g. `ubuntu`)              |
| `VPS_SSH_KEY`         | Private SSH key content                   |

---

## 📋 Health Check Endpoints

| Service  | Endpoint                       | Expected Response              |
|----------|--------------------------------|--------------------------------|
| Backend  | `GET /api/actuator/health`     | `{"status":"UP"}`              |
| AI       | `GET /ai/health`               | `{"status":"healthy",...}`     |
| Frontend | `GET /healthz`                 | `ok`                           |
| Nginx    | `GET /nginx-health`            | `nginx ok`                     |

---

## 📦 Docker Image Sizes (approximate)

| Image    | Base           | Estimated Size |
|----------|----------------|----------------|
| Backend  | jre-alpine 21  | ~200 MB        |
| Frontend | nginx-alpine   | ~30 MB         |
| AI       | python-slim + CPU torch | ~2.5 GB |

> **Tip:** Mount a named volume for `HF_HOME` so the BART model (~1.6 GB)
> is only downloaded once and reused across container restarts.
