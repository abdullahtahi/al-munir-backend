# 🚀 Quick Deployment Guide

## Deploy in 2 Steps

### Windows (PowerShell):
```powershell
.\deploy-docker.ps1 deploy
```

### Linux/Mac (Bash):
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh deploy
```

## Default Access

- **API:** http://localhost:3000/api/docs
- **Superadmin:** superadmin@gmail.com / 1234

## Common Commands

### Windows
```powershell
.\deploy-docker.ps1 status      # Check status
.\deploy-docker.ps1 logs-live   # View logs
.\deploy-docker.ps1 stop        # Stop services
.\deploy-docker.ps1 restart     # Restart services
```

### Linux/Mac
```bash
./deploy-docker.sh status      # Check status
./deploy-docker.sh logs-live   # View logs
./deploy-docker.sh stop        # Stop services
./deploy-docker.sh restart     # Restart services
```

## What Happens?

1. ✅ Validates Docker & Docker Compose
2. ✅ Checks environment variables
3. ✅ Builds Docker images
4. ✅ Starts PostgreSQL database
5. ✅ Runs database migrations (12 tables)
6. ✅ Creates superadmin user
7. ✅ Starts the backend API
8. ✅ Shows access information

## Need Help?

See `DOCKER_DEPLOYMENT.md` for detailed documentation.
