#!/bin/bash

# Al-Munir Consultancy Backend Development Setup Script

echo "🚀 Setting up Al-Munir Consultancy Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12 or higher."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update the database credentials."
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if database is accessible
echo "🔍 Checking database connection..."
if psql -h localhost -p 5432 -U postgres -d al_munir_db -c "SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful."
else
    echo "⚠️  Cannot connect to database. Please ensure PostgreSQL is running and run:"
    echo "   psql -U postgres -f scripts/setup-database.sql"
fi

echo ""
echo "🎉 Setup complete! To start the development server:"
echo "   npm run start:dev"
echo ""
echo "📚 API Documentation:"
echo "   Base URL: http://localhost:3000/api/v1"
echo "   Auth endpoints: /auth/register, /auth/login"
echo "   User endpoints: /Consultant"
echo ""
echo "🔧 Environment Configuration:"
echo "   Update .env file with your database credentials"
echo "   Change JWT_SECRET in production"
echo ""
