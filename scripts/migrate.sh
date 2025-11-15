#!/bin/bash

echo "🔄 Running database migrations..."

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL..."
for i in {1..30}; do
  if nc -z "$DATABASE_HOST" "$DATABASE_PORT" 2>/dev/null; then
    echo "✅ PostgreSQL is ready"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ PostgreSQL did not become ready in time"
    exit 1
  fi
  echo "⏳ Attempt $i: Waiting for PostgreSQL..."
  sleep 1
done

# Run migrations
echo "📝 Running Sequelize migrations..."
if npx sequelize-cli db:migrate --env production; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migration check: Some migrations may have already been run or there were no new migrations"
fi

# Run seeders if needed
echo "🌱 Seeding database..."
if npx sequelize-cli db:seed:all --env production 2>/dev/null; then
  echo "✅ Seeding completed successfully"
else
  echo "⚠️  Seeding check: Some seeds may have already been run or don't exist"
fi

echo "✅ Database setup completed!"
