# Database Setup Guide

## Prerequisites

1. PostgreSQL must be installed and running on your system.

## Database Setup Options

### Option 1: Using PostgreSQL with default user (current setup)

If you already have PostgreSQL running with a `postgres` user:

```bash
# Create the database
npm run db:create

# Run migrations to create all tables
npm run db:migrate

# (Optional) Run seeders if you create them
npm run db:seed:all
```

### Option 2: Using a different PostgreSQL user

If you need to create a new user or use different credentials:

1. Connect to PostgreSQL as a superuser:

```bash
sudo -u postgres psql
```

2. Create a new user and database:

```sql
CREATE USER your_username WITH PASSWORD 'your_password';
CREATE DATABASE munir_db OWNER your_username;
GRANT ALL PRIVILEGES ON DATABASE munir_db TO your_username;
\q
```

3. Update your `.env` file:

```env
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
```

### Option 3: Using Docker PostgreSQL (Recommended for Development)

1. Start PostgreSQL with Docker:

```bash
docker run --name postgres-munir \
  -e POSTGRES_DB=munir_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14
```

2. Run the migrations:

```bash
npm run db:migrate
```

## Migration Commands

- `npm run db:create` - Create the database
- `npm run db:migrate` - Run all pending migrations
- `npm run db:migrate:undo` - Undo the last migration
- `npm run db:migrate:undo:all` - Undo all migrations
- `npm run db:seed:all` - Run all seeders
- `npm run db:seed:undo:all` - Undo all seeders

## Troubleshooting

### Authentication Error

If you get "password authentication failed for user postgres":

1. Check PostgreSQL is running:

```bash
brew services list | grep postgresql
```

2. Start PostgreSQL if needed:

```bash
brew services start postgresql@14
```

3. Reset PostgreSQL password:

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### Permission Errors

If you get permission denied errors:

```bash
sudo chown -R $(whoami) /usr/local/var/postgresql@14/
```

### Connection Refused

If you can't connect to PostgreSQL:

1. Check if PostgreSQL is listening on port 5432:

```bash
lsof -i :5432
```

2. Check PostgreSQL configuration:

```bash
cat /usr/local/var/postgresql@14/postgresql.conf | grep listen_addresses
```

## Tables Created by Migrations

The migrations will create the following tables:

1. `Consultant` - User accounts and MLM hierarchy
2. `admissions` - Student admission records
3. `bonuses` - Bonus calculations and payments
4. `incentives` - Incentive programs and achievements
5. `transactions` - Financial transactions
6. `franchises` - Franchise locations and details

## Next Steps

After successful migration:

1. Create an admin user through the API
2. Start adding Consultant to the MLM hierarchy
3. Begin processing admissions and calculating bonuses
