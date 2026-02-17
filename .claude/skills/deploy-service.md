---
name: deploy-service
description: Deploy a SUPRA Water microservice to GCP Cloud Run with proper configuration
---

# Deploy SUPRA Water Microservice to GCP Cloud Run

When this skill is invoked, walk through the complete deployment pipeline for a SUPRA Water microservice, from build to verification. Each step must pass before proceeding to the next.

## Step 1: Identify Service and Environment

Ask the user:
- **Which service** to deploy (e.g., `billing-service`, `readings-service`, `contracts-service`, `auth-service`, `gateway`)
- **Target environment**: `staging` or `production`
- **Version/tag**: Use git commit SHA short hash or semantic version

Set the variables:
- `SERVICE_NAME` = the service name
- `ENV` = staging | production
- `PROJECT_ID` = `supra-water` (or the appropriate GCP project)
- `REGION` = `us-central1` (or the configured region)
- `IMAGE` = `gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${VERSION}`

For production deployments, confirm with the user that this is intentional and that staging has been verified.

## Step 2: Verify Dockerfile

Check that the Dockerfile exists in the service directory:

- Look for `Dockerfile` in the service root (e.g., `services/{SERVICE_NAME}/Dockerfile`)
- Verify it uses Node.js 22 as the base image (`node:22-alpine` or `node:22-slim`)
- Verify it has a multi-stage build (build stage + production stage)
- Verify it runs as non-root user
- Verify it exposes the correct port (default 8080 for Cloud Run)
- Verify it has a `HEALTHCHECK` instruction or relies on Cloud Run's health checks
- Attempt a local build: `docker build -t ${IMAGE} .`

Flag any issues found in the Dockerfile.

## Step 3: Verify Environment Variables

Check the `.env.example` file in the service directory:

- Verify all required environment variables are documented
- Common required variables for SUPRA Water services:
  - `NODE_ENV` - staging | production
  - `PORT` - HTTP port (8080)
  - `DATABASE_URL` - PostgreSQL 16 connection string
  - `LOG_LEVEL` - info | debug | warn | error
  - `CORS_ORIGINS` - Allowed origins
  - Service-specific variables (e.g., `FINKOK_API_URL`, `FINKOK_USERNAME` for billing)
- Verify that no secrets are hardcoded in the Dockerfile or source code
- Confirm that all secrets are stored in GCP Secret Manager

## Step 4: Build and Tag Docker Image

Execute the Docker build:

```bash
# Build the image
docker build \
  --build-arg NODE_ENV=${ENV} \
  --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --build-arg GIT_SHA=$(git rev-parse --short HEAD) \
  -t ${IMAGE} \
  -f services/${SERVICE_NAME}/Dockerfile \
  services/${SERVICE_NAME}

# Also tag as latest for the environment
docker tag ${IMAGE} gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${ENV}-latest
```

Verify the build completes without errors.

## Step 5: Push to Google Container Registry

Push the built image:

```bash
# Authenticate if needed
gcloud auth configure-docker

# Push both tags
docker push ${IMAGE}
docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${ENV}-latest
```

Verify the push completes and the image is visible in GCR.

## Step 6: Deploy to Cloud Run

Deploy with the appropriate configuration for the environment:

```bash
gcloud run deploy ${SERVICE_NAME}-${ENV} \
  --image ${IMAGE} \
  --region ${REGION} \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \
  --min-instances $([ "${ENV}" = "production" ] && echo "1" || echo "0") \
  --max-instances $([ "${ENV}" = "production" ] && echo "10" || echo "3") \
  --port 8080 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars "NODE_ENV=${ENV},LOG_LEVEL=$([ "${ENV}" = "production" ] && echo "info" || echo "debug")" \
  --set-secrets "DATABASE_URL=supra-${ENV}-db-url:latest,JWT_SECRET=supra-${ENV}-jwt-secret:latest" \
  --vpc-connector supra-${ENV}-connector \
  --service-account supra-${SERVICE_NAME}@${PROJECT_ID}.iam.gserviceaccount.com \
  --no-allow-unauthenticated
```

Adjust memory/CPU based on service requirements:
- `gateway`: 256Mi, 1 CPU
- `billing-service`: 1Gi, 2 CPU (PDF generation, CFDI XML signing)
- `readings-service`: 512Mi, 1 CPU
- `contracts-service`: 512Mi, 1 CPU
- `auth-service`: 256Mi, 1 CPU

## Step 7: Verify Health Check

After deployment, verify the service is healthy:

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME}-${ENV} \
  --region ${REGION} --format 'value(status.url)')

# Check health endpoint
curl -s -o /dev/null -w "%{http_code}" ${SERVICE_URL}/health
```

Expected response: HTTP 200 with a JSON body like:
```json
{
  "status": "healthy",
  "service": "{SERVICE_NAME}",
  "version": "{VERSION}",
  "environment": "{ENV}",
  "database": "connected",
  "uptime": "...",
  "timestamp": "..."
}
```

If health check fails, check Cloud Run logs: `gcloud run services logs read ${SERVICE_NAME}-${ENV} --region ${REGION} --limit 50`

## Step 8: Update Traefik Routing

If the service is new or routing has changed, update the Traefik configuration:

- Check `infrastructure/traefik/dynamic.yml` for existing route rules
- Verify the service has a proper route with:
  - Path prefix matching (e.g., `/api/v1/billing` routes to `billing-service`)
  - Proper middleware chain (rate limiting, CORS, auth)
  - TLS termination
  - Health check configuration for load balancing
- If using Traefik with Cloud Run, ensure the backend URL points to the Cloud Run service URL

## Step 9: Verify Prometheus Metrics

Confirm that the deployed service is being scraped by Prometheus:

- Check that the service exposes `/metrics` endpoint
- Verify Prometheus scrape config includes the new service
- Check `infrastructure/prometheus/prometheus.yml` for the scrape target
- Query Prometheus for recent metrics: `up{service="${SERVICE_NAME}", env="${ENV}"}`
- Verify key metrics are present: `http_request_duration_seconds`, `http_requests_total`

## Step 10: Run Smoke Tests

Execute smoke tests against the deployed service:

```bash
# Run the smoke test suite for the service
npm run test:smoke -- --service ${SERVICE_NAME} --env ${ENV}
```

If no automated smoke tests exist, manually verify:
- `GET /health` returns 200
- `GET /metrics` returns Prometheus format
- Key API endpoints return expected status codes (may need auth token)
- Database connectivity works (health check covers this)
- Response times are within acceptable limits (<500ms for p95)

Report the final deployment status:

```
DEPLOYMENT REPORT
=================
Service:     {SERVICE_NAME}
Environment: {ENV}
Version:     {VERSION}
Image:       {IMAGE}
URL:         {SERVICE_URL}
Status:      SUCCESS / FAILED
Health:      HEALTHY / UNHEALTHY
Metrics:     SCRAPED / NOT SCRAPED
Smoke Tests: PASSED / FAILED
Deployed At: {timestamp}
```
