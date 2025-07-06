-- Initialize Novel Craft Database
-- This script is run when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (will be created by Prisma migrations)
-- This file is mainly for any custom initialization needed
