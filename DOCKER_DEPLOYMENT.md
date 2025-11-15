# Docker Deployment Guide for Al-Munir Backend

## Prerequisites

1. **Docker** - [Install Docker](https://docs.docker.com/get-docker/)
2. **Docker Compose** - [Install Docker Compose](https://docs.docker.com/compose/install/)
3. **Linux/Mac/Windows with WSL2** (for running the deployment script)

## Quick Start

### Option 1: Using the Deployment Script (Recommended)

```bash
cd al-munir-backend
chmod +x deploy.sh
./deploy.sh
```

This will:
- Check Docker and Docker Compose installation
- Create `.env` file with default configuration
- Build and start all containers
- Display access information

### Option 2: Manual Setup

1. **Navigate to the project directory**
   ```bash
   cd al-munir-backend
   ```

2. **Copy environment file**
   ```bash
   cp .env.docker .env
   ```

3. **Update .env with your settings** (optional)
   ```bash
   nano .env  # or use your preferred editor
   ```

4. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

5. **Verify services are running**
   ```bash
   docker-compose ps
   ```

## Accessing Your Application

### From Local Machine
```
http://localhost:3000
```

### From Network/Public IP
Get your machine's IP address:
```bash
hostname -I
```

Then access:
```
http://<YOUR_MACHINE_IP>:3000
```

### API Documentation (Swagger)
```
http://<YOUR_MACHINE_IP>:3000/api/docs
```

### Database Connection
```
Host: <YOUR_MACHINE_IP>
Port: 5432
Username: postgres
Password: postgres (or your configured password)
Database: al_munir_db
```

## Configuration

### Environment Variables (.env)

Edit `.env` file to customize:

```dotenv
# Database
DATABASE_HOST=postgres          # Don't change (service name)
DATABASE_PORT=5432
DATABASE_NAME=al_munir_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres      # CHANGE IN PRODUCTION

# JWT
JWT_SECRET=your-secret-key      # CHANGE IN PRODUCTION
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=production

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_LIMIT=100

# CORS
CORS_ORIGIN=*                   # Restrict in production
```

### Important Security Notes

⚠️ **Before deploying to production:**

1. **Change JWT_SECRET** - Generate a strong random string
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Change DATABASE_PASSWORD** - Use a strong password

3. **Update CORS_ORIGIN** - Don't use `*` in production
   ```
   CORS_ORIGIN=https://yourdomain.com
   ```

4. **Use HTTPS** - Set up SSL/TLS certificates (use Nginx reverse proxy)

## Managing Containers

### View Logs
```bash
# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres

# All services
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart backend
docker-compose restart postgres
```

### Access Database Shell
```bash
docker-compose exec postgres psql -U postgres -d al_munir_db
```

### Remove Everything (Warning: Deletes data!)
```bash
docker-compose down -v
```

## Database Migrations

### Run Migrations
```bash
docker-compose exec backend npm run db:migrate
```

### Undo Migrations
```bash
docker-compose exec backend npm run db:migrate:undo:all
```

## Troubleshooting

### Port Already in Use
If port 3000 or 5432 is already in use:

Edit `docker-compose.yml` and change the ports:
```yaml
services:
  backend:
    ports:
      - "3001:3000"  # Changed from 3000:3000

  postgres:
    ports:
      - "5433:5432"  # Changed from 5432:5432
```

### Container Won't Start
Check logs:
```bash
docker-compose logs backend
```

### Database Connection Failed
Verify PostgreSQL is running:
```bash
docker-compose ps
```

If not running, start it:
```bash
docker-compose up -d postgres
```

### Permission Denied on Deploy Script
Make it executable:
```bash
chmod +x deploy.sh
```

## Performance Optimization

### Set Resource Limits

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Use .env.production for Production

```bash
cp .env.docker .env.production
# Edit .env.production with production values
docker-compose --env-file .env.production up -d
```

## SSL/TLS Configuration (HTTPS)

### Option 1: Using Nginx Reverse Proxy

Create `nginx.conf`:
```nginx
upstream backend {
    server backend:3000;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Option 2: Using Let's Encrypt

```bash
docker run --rm -v /path/to/certs:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d yourdomain.com
```

## Monitoring and Health Checks

The docker-compose configuration includes health checks. Monitor them:

```bash
docker-compose ps
```

### Custom Health Check
The application is configured with HTTP health checks at port 3000.

## Backup and Restore

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres al_munir_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres al_munir_db < backup.sql
```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Review the main README.md in the project
3. Check docker-compose.yml configuration

---

**Happy Deploying! 🚀**
