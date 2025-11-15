#!/bin/bash

# Al-Munir Backend - Docker Compose Deployment Script
# This script deploys the application using Docker Compose

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
}

# Function to check if Docker is installed and running
check_docker() {
    print_info "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Function to check if Docker Compose is installed
check_docker_compose() {
    print_info "Checking Docker Compose installation..."
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_success "Docker Compose is installed"
}

# Function to check if .env file exists
check_env_file() {
    print_info "Checking environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        
        if [ -f "${SCRIPT_DIR}/.env.example" ]; then
            cp "${SCRIPT_DIR}/.env.example" "$ENV_FILE"
            print_success "Created .env file from .env.example"
            print_warning "Please update .env file with your configuration before deploying!"
            read -p "Press Enter to continue or Ctrl+C to exit and edit .env..."
        else
            print_error ".env.example not found. Cannot create .env file."
            exit 1
        fi
    else
        print_success ".env file exists"
    fi
}

# Function to validate environment variables
validate_env() {
    print_info "Validating environment variables..."
    
    # Load .env file
    source "$ENV_FILE"
    
    # Check critical variables
    MISSING_VARS=()
    
    [ -z "$DATABASE_NAME" ] && MISSING_VARS+=("DATABASE_NAME")
    [ -z "$DATABASE_USER" ] && MISSING_VARS+=("DATABASE_USER")
    [ -z "$DATABASE_PASSWORD" ] && MISSING_VARS+=("DATABASE_PASSWORD")
    [ -z "$JWT_SECRET" ] && MISSING_VARS+=("JWT_SECRET")
    
    if [ ${#MISSING_VARS[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${MISSING_VARS[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    # Check if JWT_SECRET is the default value
    if [ "$JWT_SECRET" = "your-super-secret-jwt-key-here-change-in-production" ]; then
        print_warning "JWT_SECRET is using the default value. Consider changing it for production!"
    fi
    
    print_success "Environment variables validated"
}

# Function to stop existing containers
stop_containers() {
    print_info "Stopping existing containers..."
    
    if docker-compose -f "$COMPOSE_FILE" ps -q &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" down
        print_success "Stopped existing containers"
    else
        print_info "No existing containers to stop"
    fi
}

# Function to clean up old containers and volumes
cleanup() {
    print_warning "This will remove all containers, networks, and volumes..."
    read -p "Are you sure you want to clean up? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up..."
        docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Function to build Docker images
build_images() {
    print_info "Building Docker images..."
    
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    print_success "Docker images built successfully"
}

# Function to start services
start_services() {
    print_info "Starting services..."
    
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_success "Services started"
}

# Function to wait for services to be healthy
wait_for_services() {
    print_info "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up (healthy)"; then
            print_success "Services are healthy"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    print_warning "Services took longer than expected to become healthy"
    print_info "Check logs with: docker-compose logs -f"
}

# Function to show service status
show_status() {
    print_header "Service Status"
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
}

# Function to show logs
show_logs() {
    print_header "Recent Logs"
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    echo ""
    print_info "To follow logs in real-time, run: docker-compose logs -f"
}

# Function to display access information
show_access_info() {
    print_header "Access Information"
    
    # Load .env to get port
    source "$ENV_FILE"
    PORT=${PORT:-3000}
    
    echo -e "${GREEN}🚀 Application URL:${NC}"
    echo -e "   ${BLUE}http://localhost:${PORT}${NC}"
    echo ""
    echo -e "${GREEN}📚 API Documentation (Swagger):${NC}"
    echo -e "   ${BLUE}http://localhost:${PORT}/api/docs${NC}"
    echo ""
    echo -e "${GREEN}🔗 API Base URL:${NC}"
    echo -e "   ${BLUE}http://localhost:${PORT}/api/v1${NC}"
    echo ""
    echo -e "${GREEN}👤 Default Superadmin Credentials:${NC}"
    echo -e "   ${YELLOW}Email:${NC} superadmin@gmail.com"
    echo -e "   ${YELLOW}Password:${NC} 1234"
    echo -e "   ${RED}⚠️  CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!${NC}"
    echo ""
    echo -e "${GREEN}🗄️  Database Access:${NC}"
    echo -e "   ${YELLOW}Host:${NC} localhost:5432"
    echo -e "   ${YELLOW}Database:${NC} ${DATABASE_NAME:-al_munir_db}"
    echo -e "   ${YELLOW}Username:${NC} ${DATABASE_USER:-postgres}"
    echo ""
}

# Function to show help
show_help() {
    echo "Al-Munir Backend - Docker Compose Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy      - Full deployment (stop, build, start)"
    echo "  start       - Start existing containers"
    echo "  stop        - Stop running containers"
    echo "  restart     - Restart containers"
    echo "  status      - Show service status"
    echo "  logs        - Show recent logs"
    echo "  logs-live   - Follow logs in real-time"
    echo "  cleanup     - Remove all containers, networks, and volumes"
    echo "  rebuild     - Rebuild and restart services"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy         # Full deployment"
    echo "  $0 logs-live      # Watch logs in real-time"
    echo "  $0 restart        # Restart all services"
    echo ""
}

# Main deployment function
deploy() {
    print_header "Al-Munir Backend - Docker Compose Deployment"
    
    # Pre-deployment checks
    check_docker
    check_docker_compose
    check_env_file
    validate_env
    
    # Stop existing containers
    stop_containers
    
    # Build images
    build_images
    
    # Start services
    start_services
    
    # Wait for services
    wait_for_services
    
    # Show status
    show_status
    
    # Show access information
    show_access_info
    
    print_success "Deployment completed successfully!"
    print_info "Run 'docker-compose logs -f' to view live logs"
}

# Command handling
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    start)
        print_header "Starting Services"
        check_docker
        check_docker_compose
        start_services
        wait_for_services
        show_status
        show_access_info
        ;;
    stop)
        print_header "Stopping Services"
        check_docker
        check_docker_compose
        stop_containers
        ;;
    restart)
        print_header "Restarting Services"
        check_docker
        check_docker_compose
        docker-compose -f "$COMPOSE_FILE" restart
        wait_for_services
        show_status
        ;;
    status)
        check_docker
        check_docker_compose
        show_status
        ;;
    logs)
        check_docker
        check_docker_compose
        show_logs
        ;;
    logs-live)
        print_info "Following logs (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" logs -f
        ;;
    cleanup)
        check_docker
        check_docker_compose
        cleanup
        ;;
    rebuild)
        print_header "Rebuilding Services"
        check_docker
        check_docker_compose
        stop_containers
        build_images
        start_services
        wait_for_services
        show_status
        show_access_info
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
