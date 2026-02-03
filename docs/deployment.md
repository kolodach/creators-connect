# Deployment

This repo currently automates Convex deployments via GitHub Actions. Frontend deployment is not yet wired to a specific hosting provider.

## Convex deploy workflow
The workflow in `.github/workflows/convex-deploy.yml` runs on pushes to `main` and on manual dispatch.

Requirements:
- GitHub secret `CONVEX_DEPLOY_KEY` set for the repository.
- Node.js 20 and pnpm (configured in the workflow).

What it does:
- Installs dependencies.
- Runs `pnpm exec convex deploy`.

## Manual Convex deploy
Run this from the repo root:
- `pnpm exec convex deploy`

## Frontend deployment
No automated deployment is configured for the Next.js app yet. Typical options include Vercel or a container-based deploy. Ensure the frontend environment variables are set to the target Convex deployment.
