# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache dependency layer first
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -q

# ─────────────────────────────────────────
# Stage 2: Runtime (minimal JRE)
# ─────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy artifact from builder
COPY --from=builder /build/target/*.jar app.jar

# Expose application port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8081/api/actuator/health || exit 1

USER appuser

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
