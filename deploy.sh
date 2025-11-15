#!/bin/bash

# Al-Munir Backend Docker Deployment Script
# This script helps set up and run the application with Docker Compose

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Al-Munir Backend Docker Setup${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}\n"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.docker...${NC}"
    cp .env.docker .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please update .env with your actual configuration values!${NC}\n"
else
    echo -e "${GREEN}✓ .env file already exists${NC}\n"
fi

# Build and start containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}\n"
docker-compose up -d --build

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check if backend is running
if docker-compose ps | grep -q "al-munir-backend.*Up"; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
    echo -e "${YELLOW}Checking logs:${NC}"
    docker-compose logs backend
    exit 1
fi

# Check if PostgreSQL is running
if docker-compose ps | grep -q "al-munir-postgres.*Up"; then
    echo -e "${GREEN}✓ PostgreSQL database is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Successful!${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Get the machine IP
MACHINE_IP=$(hostname -I | awk '{print $1}')

echo -e "${GREEN}Your application is now running!${NC}\n"
echo -e "Access the application at:"
echo -e "  ${YELLOW}Local:${NC} http://localhost:3000"
echo -e "  ${YELLOW}Network:${NC} http://${MACHINE_IP}:3000"
echo -e "  ${YELLOW}Swagger Docs:${NC} http://${MACHINE_IP}:3000/api/docs\n"

echo -e "${GREEN}Database Configuration:${NC}"
echo -e "  ${YELLOW}Host:${NC} ${MACHINE_IP}"
echo -e "  ${YELLOW}Port:${NC} 5432\n"

echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  ${GREEN}View logs:${NC} docker-compose logs -f backend"
echo -e "  ${GREEN}Stop services:${NC} docker-compose down"
echo -e "  ${GREEN}Restart services:${NC} docker-compose restart"
echo -e "  ${GREEN}Access database:${NC} docker-compose exec postgres psql -U postgres -d al_munir_db\n"
