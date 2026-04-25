# ─────────────────────────────────────────
# Stage 1: Dependencies
# ─────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install into a prefix so we can copy cleanly
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ─────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────
FROM python:3.11-slim AS runtime

# Security: non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY main.py .

# HuggingFace model cache dir (can be volume-mounted for persistence)
ENV HF_HOME=/app/.cache/huggingface
RUN mkdir -p /app/.cache/huggingface && chown -R appuser:appuser /app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

USER appuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--log-level", "info"]
