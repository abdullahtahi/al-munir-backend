-- Al-Munir Consultancy Database Setup Script
-- Run this in your PostgreSQL client before starting the application

-- Create database
CREATE DATABASE al_munir_db;

-- Create user (if not exists)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'al_munir_user') THEN
      
      CREATE ROLE al_munir_user LOGIN PASSWORD 'al_munir_password';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE al_munir_db TO al_munir_user;

-- Connect to the database
\c al_munir_db;

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO al_munir_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO al_munir_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO al_munir_user;

-- Default admin user will be created on first application start
