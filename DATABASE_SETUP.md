# Database Setup Guide

This guide covers PostgreSQL database setup for the Digilaw AI application.

## Local Development Setup

### Install PostgreSQL

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Remember the password for `postgres` user
4. Default port: 5432

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

1. Connect to PostgreSQL:
```bash
psql -U postgres -h localhost
```

2. Create database:
```sql
CREATE DATABASE digilaw;
CREATE USER digilaw_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE digilaw TO digilaw_user;
\q
```

3. Test connection:
```bash
psql -U digilaw_user -d digilaw -h localhost
```

## Database Schema

The application uses TypeORM with automatic schema synchronization in development.

### Users Table Structure

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_sub VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('lawyer', 'student', 'citizen')) DEFAULT 'citizen',
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_cognito_sub ON users(cognito_sub);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
```

## Environment Configuration

### Backend .env file
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=digilaw_user
DB_PASSWORD=your_password
DB_NAME=digilaw
```

## Production Setup

### AWS RDS PostgreSQL

1. **Create RDS Instance**
   - Engine: PostgreSQL 14+
   - Instance class: db.t3.micro (for development)
   - Storage: 20GB GP2
   - Multi-AZ: No (for development)

2. **Security Group Configuration**
   ```
   Type: PostgreSQL
   Port: 5432
   Source: Your application security group
   ```

3. **Parameter Group** (optional)
   - Create custom parameter group for optimization
   - Adjust `shared_preload_libraries` if needed

4. **Backup Configuration**
   - Backup retention: 7 days minimum
   - Backup window: During low traffic hours
   - Enable automated backups

### Connection Pooling

For production, consider using connection pooling:

```typescript
// In database.module.ts
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User],
    synchronize: false, // Set to false in production
    logging: false,
    extra: {
      max: 20, // Maximum connections in pool
      min: 5,  // Minimum connections in pool
      acquire: 30000, // Maximum time to get connection
      idle: 10000, // Maximum time connection can be idle
    },
  }),
})
```

## Migrations

For production, use TypeORM migrations instead of synchronize:

### Generate Migration
```bash
npm run typeorm:generate-migration -- --name InitialSchema
```

### Run Migrations
```bash
npm run typeorm:run-migrations
```

### Migration Configuration
```typescript
// In package.json scripts
{
  "typeorm:generate-migration": "typeorm-ts-node-commonjs migration:generate",
  "typeorm:run-migrations": "typeorm-ts-node-commonjs migration:run",
  "typeorm:revert-migration": "typeorm-ts-node-commonjs migration:revert"
}
```

## Data Seeding

### Development Seed Data
```typescript
// src/database/seeds/user.seed.ts
import { User, UserRole } from '../entities/user.entity';

export const seedUsers = [
  {
    cognitoSub: 'test-lawyer-1',
    email: 'lawyer@test.com',
    name: 'Test Lawyer',
    phoneNumber: '9876543210',
    state: 'Maharashtra',
    city: 'Mumbai',
    role: UserRole.LAWYER,
    phoneVerified: true,
    emailVerified: true,
  },
  {
    cognitoSub: 'test-student-1',
    email: 'student@test.com',
    name: 'Test Student',
    phoneNumber: '9876543211',
    state: 'Delhi',
    city: 'New Delhi',
    role: UserRole.STUDENT,
    phoneVerified: true,
    emailVerified: true,
  },
];
```

## Backup and Recovery

### Local Backup
```bash
# Create backup
pg_dump -U digilaw_user -h localhost digilaw > backup.sql

# Restore backup
psql -U digilaw_user -h localhost digilaw < backup.sql
```

### AWS RDS Backup
- Automated backups are enabled by default
- Point-in-time recovery available
- Manual snapshots for major releases

## Monitoring

### Key Metrics to Monitor
- Connection count
- Query performance
- Database size
- Lock waits
- Cache hit ratio

### CloudWatch Metrics (AWS RDS)
- CPUUtilization
- DatabaseConnections
- FreeStorageSpace
- ReadLatency/WriteLatency

## Security

### Database Security Checklist
- [ ] Use strong passwords
- [ ] Enable SSL/TLS connections
- [ ] Restrict network access
- [ ] Regular security updates
- [ ] Audit logging enabled
- [ ] Backup encryption
- [ ] Parameter group hardening

### SSL Configuration
```typescript
// For production with SSL
extra: {
  ssl: {
    rejectUnauthorized: false, // Set to true with proper certificates
  },
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if PostgreSQL is running
   - Verify host and port configuration
   - Check firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check pg_hba.conf configuration
   - Ensure user has proper permissions

3. **Database Does Not Exist**
   - Create database manually
   - Check database name spelling
   - Verify user has access to database

4. **Performance Issues**
   - Check query execution plans
   - Add appropriate indexes
   - Monitor connection pool usage
   - Analyze slow query logs

### Debug Commands
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# View active connections
SELECT * FROM pg_stat_activity;

# Check database size
SELECT pg_size_pretty(pg_database_size('digilaw'));

# View table sizes
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size 
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```