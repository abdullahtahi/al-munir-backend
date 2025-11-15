# Al-Munir Backend - Docker Compose Deployment Script (PowerShell)
# This script deploys the application using Docker Compose on Windows

param(
    [Parameter(Position=0)]
    [ValidateSet('deploy', 'start', 'stop', 'restart', 'status', 'logs', 'logs-live', 'cleanup', 'rebuild', 'help')]
    [string]$Command = 'deploy'
)

# Script configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ScriptDir ".env"
$ComposeFile = Join-Path $ScriptDir "docker-compose.yml"

# Function to print colored messages
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
}

# Function to check if Docker is installed and running
function Test-Docker {
    Write-Info "Checking Docker installation..."
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
    
    try {
        docker info | Out-Null
        Write-Success "Docker is installed and running"
    }
    catch {
        Write-Error-Custom "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    }
}

# Function to check if Docker Compose is installed
function Test-DockerCompose {
    Write-Info "Checking Docker Compose installation..."
    
    $hasDockerCompose = $false
    
    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        $hasDockerCompose = $true
    }
    elseif (docker compose version 2>$null) {
        $hasDockerCompose = $true
    }
    
    if (-not $hasDockerCompose) {
        Write-Error-Custom "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    }
    
    Write-Success "Docker Compose is installed"
}

# Function to check if .env file exists
function Test-EnvFile {
    Write-Info "Checking environment configuration..."
    
    if (-not (Test-Path $EnvFile)) {
        Write-Warning-Custom ".env file not found. Creating from .env.example..."
        
        $ExampleFile = Join-Path $ScriptDir ".env.example"
        if (Test-Path $ExampleFile) {
            Copy-Item $ExampleFile $EnvFile
            Write-Success "Created .env file from .env.example"
            Write-Warning-Custom "Please update .env file with your configuration before deploying!"
            Read-Host "Press Enter to continue or Ctrl+C to exit and edit .env"
        }
        else {
            Write-Error-Custom ".env.example not found. Cannot create .env file."
            exit 1
        }
    }
    else {
        Write-Success ".env file exists"
    }
}

# Function to validate environment variables
function Test-EnvVariables {
    Write-Info "Validating environment variables..."
    
    # Load .env file
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
    
    # Check critical variables
    $MissingVars = @()
    
    if (-not $env:DATABASE_NAME) { $MissingVars += "DATABASE_NAME" }
    if (-not $env:DATABASE_USER) { $MissingVars += "DATABASE_USER" }
    if (-not $env:DATABASE_PASSWORD) { $MissingVars += "DATABASE_PASSWORD" }
    if (-not $env:JWT_SECRET) { $MissingVars += "JWT_SECRET" }
    
    if ($MissingVars.Count -gt 0) {
        Write-Error-Custom "Missing required environment variables:"
        $MissingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        exit 1
    }
    
    # Check if JWT_SECRET is the default value
    if ($env:JWT_SECRET -eq "your-super-secret-jwt-key-here-change-in-production") {
        Write-Warning-Custom "JWT_SECRET is using the default value. Consider changing it for production!"
    }
    
    Write-Success "Environment variables validated"
}

# Function to stop existing containers
function Stop-Containers {
    Write-Info "Stopping existing containers..."
    
    try {
        docker-compose -f $ComposeFile down 2>$null
        Write-Success "Stopped existing containers"
    }
    catch {
        Write-Info "No existing containers to stop"
    }
}

# Function to clean up old containers and volumes
function Remove-AllContainers {
    Write-Warning-Custom "This will remove all containers, networks, and volumes..."
    $response = Read-Host "Are you sure you want to clean up? (y/N)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Info "Cleaning up..."
        docker-compose -f $ComposeFile down -v --remove-orphans
        Write-Success "Cleanup completed"
    }
    else {
        Write-Info "Cleanup cancelled"
    }
}

# Function to build Docker images
function Build-Images {
    Write-Info "Building Docker images..."
    
    docker-compose -f $ComposeFile build --no-cache
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker images built successfully"
    }
    else {
        Write-Error-Custom "Failed to build Docker images"
        exit 1
    }
}

# Function to start services
function Start-Services {
    Write-Info "Starting services..."
    
    docker-compose -f $ComposeFile up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services started"
    }
    else {
        Write-Error-Custom "Failed to start services"
        exit 1
    }
}

# Function to wait for services to be healthy
function Wait-ForServices {
    Write-Info "Waiting for services to be healthy..."
    
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        $status = docker-compose -f $ComposeFile ps
        if ($status -match "Up \(healthy\)") {
            Write-Success "Services are healthy"
            return
        }
        
        $attempt++
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
    
    Write-Host ""
    Write-Warning-Custom "Services took longer than expected to become healthy"
    Write-Info "Check logs with: docker-compose logs -f"
}

# Function to show service status
function Show-Status {
    Write-Header "Service Status"
    docker-compose -f $ComposeFile ps
    Write-Host ""
}

# Function to show logs
function Show-Logs {
    Write-Header "Recent Logs"
    docker-compose -f $ComposeFile logs --tail=50
    Write-Host ""
    Write-Info "To follow logs in real-time, run: docker-compose logs -f"
}

# Function to display access information
function Show-AccessInfo {
    Write-Header "Access Information"
    
    # Load .env to get port
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^PORT=(.*)$') {
            $env:PORT = $matches[1].Trim()
        }
        if ($_ -match '^DATABASE_NAME=(.*)$') {
            $env:DATABASE_NAME = $matches[1].Trim()
        }
        if ($_ -match '^DATABASE_USER=(.*)$') {
            $env:DATABASE_USER = $matches[1].Trim()
        }
    }
    
    $port = if ($env:PORT) { $env:PORT } else { "3000" }
    
    Write-Host "🚀 Application URL:" -ForegroundColor Green
    Write-Host "   http://localhost:$port" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 API Documentation (Swagger):" -ForegroundColor Green
    Write-Host "   http://localhost:$port/api/docs" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔗 API Base URL:" -ForegroundColor Green
    Write-Host "   http://localhost:$port/api/v1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "👤 Default Superadmin Credentials:" -ForegroundColor Green
    Write-Host "   Email: superadmin@gmail.com" -ForegroundColor Yellow
    Write-Host "   Password: 1234" -ForegroundColor Yellow
    Write-Host "   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🗄️  Database Access:" -ForegroundColor Green
    Write-Host "   Host: localhost:5432" -ForegroundColor Yellow
    Write-Host "   Database: $($env:DATABASE_NAME)" -ForegroundColor Yellow
    Write-Host "   Username: $($env:DATABASE_USER)" -ForegroundColor Yellow
    Write-Host ""
}

# Function to show help
function Show-Help {
    Write-Host "Al-Munir Backend - Docker Compose Deployment Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\deploy-docker.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  deploy      - Full deployment (stop, build, start)"
    Write-Host "  start       - Start existing containers"
    Write-Host "  stop        - Stop running containers"
    Write-Host "  restart     - Restart containers"
    Write-Host "  status      - Show service status"
    Write-Host "  logs        - Show recent logs"
    Write-Host "  logs-live   - Follow logs in real-time"
    Write-Host "  cleanup     - Remove all containers, networks, and volumes"
    Write-Host "  rebuild     - Rebuild and restart services"
    Write-Host "  help        - Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\deploy-docker.ps1 deploy         # Full deployment"
    Write-Host "  .\deploy-docker.ps1 logs-live      # Watch logs in real-time"
    Write-Host "  .\deploy-docker.ps1 restart        # Restart all services"
    Write-Host ""
}

# Main deployment function
function Invoke-Deploy {
    Write-Header "Al-Munir Backend - Docker Compose Deployment"
    
    # Pre-deployment checks
    Test-Docker
    Test-DockerCompose
    Test-EnvFile
    Test-EnvVariables
    
    # Stop existing containers
    Stop-Containers
    
    # Build images
    Build-Images
    
    # Start services
    Start-Services
    
    # Wait for services
    Wait-ForServices
    
    # Show status
    Show-Status
    
    # Show access information
    Show-AccessInfo
    
    Write-Success "Deployment completed successfully!"
    Write-Info "Run 'docker-compose logs -f' to view live logs"
}

# Command handling
switch ($Command) {
    'deploy' {
        Invoke-Deploy
    }
    'start' {
        Write-Header "Starting Services"
        Test-Docker
        Test-DockerCompose
        Start-Services
        Wait-ForServices
        Show-Status
        Show-AccessInfo
    }
    'stop' {
        Write-Header "Stopping Services"
        Test-Docker
        Test-DockerCompose
        Stop-Containers
    }
    'restart' {
        Write-Header "Restarting Services"
        Test-Docker
        Test-DockerCompose
        docker-compose -f $ComposeFile restart
        Wait-ForServices
        Show-Status
    }
    'status' {
        Test-Docker
        Test-DockerCompose
        Show-Status
    }
    'logs' {
        Test-Docker
        Test-DockerCompose
        Show-Logs
    }
    'logs-live' {
        Write-Info "Following logs (Ctrl+C to exit)..."
        docker-compose -f $ComposeFile logs -f
    }
    'cleanup' {
        Test-Docker
        Test-DockerCompose
        Remove-AllContainers
    }
    'rebuild' {
        Write-Header "Rebuilding Services"
        Test-Docker
        Test-DockerCompose
        Stop-Containers
        Build-Images
        Start-Services
        Wait-ForServices
        Show-Status
        Show-AccessInfo
    }
    'help' {
        Show-Help
    }
    default {
        Write-Error-Custom "Unknown command: $Command"
        Write-Host ""
        Show-Help
        exit 1
    }
}
