#!/bin/sh
set -e

echo "🚀 Al-Munir Backend - Starting..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until node -e "const { Client } = require('pg'); const c = new Client({host: process.env.DATABASE_HOST, port: process.env.DATABASE_PORT, user: process.env.DATABASE_USER, password: process.env.DATABASE_PASSWORD, database: process.env.DATABASE_NAME}); c.connect().then(() => {console.log('✅ Database connected'); c.end(); process.exit(0);}).catch(e => {console.log('❌ Waiting...'); process.exit(1);});" 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run migrations
echo "🔄 Running database migrations..."
if npm run db:migrate; then
  echo "✅ Migrations completed successfully!"
else
  echo "⚠️ Migration failed or already up to date"
fi

# Start the application
echo "🎉 Starting NestJS application..."
exec node dist/src/main
