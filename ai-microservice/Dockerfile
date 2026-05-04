# ─────────────────────────────────────────
# Stage 1: Dependencies (builder)
# ─────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build tools only (not kept in final image)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install into isolated prefix — no cache, CPU-only torch index
RUN pip install --no-cache-dir \
    --prefix=/install \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements.txt

# ─────────────────────────────────────────
# Stage 2: Runtime (final image)
# ─────────────────────────────────────────
FROM python:3.11-slim AS runtime

# Security: non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy ONLY the pre-installed packages from builder (no gcc, no apt caches)
COPY --from=builder /install /usr/local

# Copy application source
COPY main.py .

# HuggingFace model cache dir (mount as volume to persist model downloads)
ENV HF_HOME=/app/.cache/huggingface
RUN mkdir -p /app/.cache/huggingface && chown -R appuser:appuser /app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

USER appuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "1", "--log-level", "info"]
