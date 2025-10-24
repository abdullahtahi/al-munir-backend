#!/bin/bash

# Al-Munir Consultancy MLM Backend Quick Start

echo "🚀 Starting Al-Munir Consultancy MLM Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if PostgreSQL is running
if ! pg_isready -q 2>/dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL and run:"
    echo "   createdb al_munir_db"
    echo "   Then run this script again."
    exit 1
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw al_munir_db; then
    echo "📊 Creating database..."
    createdb al_munir_db
    echo "✅ Database created successfully!"
else
    echo "✅ Database already exists."
fi

echo ""
echo "🎉 Starting the development server..."
echo "📚 API Documentation will be available at: http://localhost:3000/api/docs"
echo "🔗 API Base URL: http://localhost:3000/api/v1"
echo ""

# Start the development server
npm run start:dev
