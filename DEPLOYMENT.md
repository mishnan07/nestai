# Deployment Guide

This guide covers deployment options for the Digilaw AI application.

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- AWS Account with Cognito configured

### Setup Steps

1. **Clone and Install**
```bash
git clone <repository-url>
cd digilaw-ai

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
# Configure environment variables

# Backend
cd ../backend
npm install
cp .env.example .env
# Configure environment variables
```

2. **Database Setup**
```bash
# Create PostgreSQL database
createdb digilaw
```

3. **Start Services**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Production Deployment

### Option 1: AWS Full Stack

#### Frontend - AWS Amplify
1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your Git repository
   - Select frontend folder as root

2. **Build Settings**
```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - cd frontend
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: frontend/.next
        files:
          - '**/*'
      cache:
        paths:
          - frontend/node_modules/**/*
```

3. **Environment Variables**
```
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_pool_id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

#### Backend - AWS ECS with Fargate

1. **Create Dockerfile**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

2. **Create ECS Task Definition**
```json
{
  "family": "digilaw-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "digilaw-backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/digilaw-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/digilaw-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

3. **Create ECS Service**
```bash
aws ecs create-service \
  --cluster digilaw-cluster \
  --service-name digilaw-backend-service \
  --task-definition digilaw-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-abcdef],assignPublicIp=ENABLED}"
```

#### Database - AWS RDS
1. **Create RDS Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier digilaw-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-secure-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678 \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --storage-encrypted
```

### Option 2: Vercel + Railway

#### Frontend - Vercel
1. **Connect Repository**
   - Go to Vercel dashboard
   - Import your repository
   - Set root directory to `frontend`

2. **Environment Variables**
```
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_pool_id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

3. **Build Settings**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

#### Backend - Railway
1. **Connect Repository**
   - Go to Railway dashboard
   - Create new project from GitHub
   - Select backend folder

2. **Environment Variables**
```
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_NAME=railway
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=your_pool_id
COGNITO_CLIENT_ID=your_client_id
```

3. **Railway.toml**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start:prod"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

### Option 3: DigitalOcean App Platform

#### Create App Spec
```yaml
name: digilaw-ai
services:
- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/digilaw-ai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NEXT_PUBLIC_COGNITO_USER_POOL_ID
    value: your_pool_id
  - key: NEXT_PUBLIC_COGNITO_CLIENT_ID
    value: your_client_id
  - key: NEXT_PUBLIC_API_URL
    value: ${backend.PUBLIC_URL}/api

- name: backend
  source_dir: /backend
  github:
    repo: your-username/digilaw-ai
    branch: main
  run_command: npm run start:prod
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: DB_HOST
    value: ${db.HOSTNAME}
  - key: DB_PORT
    value: ${db.PORT}
  - key: DB_USERNAME
    value: ${db.USERNAME}
  - key: DB_PASSWORD
    value: ${db.PASSWORD}
  - key: DB_NAME
    value: ${db.DATABASE}

databases:
- name: db
  engine: PG
  version: "14"
  size: basic-xs
```

## CI/CD Pipeline

### GitHub Actions

#### Frontend Deployment
```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Build
      run: |
        cd frontend
        npm run build
      env:
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: ${{ secrets.COGNITO_USER_POOL_ID }}
        NEXT_PUBLIC_COGNITO_CLIENT_ID: ${{ secrets.COGNITO_CLIENT_ID }}
        NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend
```

#### Backend Deployment
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: digilaw-backend
        IMAGE_TAG: ${{ github.sha }}
      run: |
        cd backend
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    
    - name: Update ECS service
      run: |
        aws ecs update-service \
          --cluster digilaw-cluster \
          --service digilaw-backend-service \
          --force-new-deployment
```

## Environment-Specific Configurations

### Development
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend
NODE_ENV=development
DB_HOST=localhost
```

### Staging
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://staging-api.digilaw.com/api

# Backend
NODE_ENV=staging
DB_HOST=staging-db.digilaw.com
```

### Production
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.digilaw.com/api

# Backend
NODE_ENV=production
DB_HOST=prod-db.digilaw.com
```

## Monitoring and Logging

### Application Monitoring
- **Frontend**: Vercel Analytics, Sentry
- **Backend**: AWS CloudWatch, DataDog
- **Database**: AWS RDS Performance Insights

### Health Checks
```typescript
// backend/src/health/health.controller.ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

## Security Considerations

### Production Security Checklist
- [ ] HTTPS enabled for all services
- [ ] Environment variables secured
- [ ] Database connections encrypted
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Backup and disaster recovery plan

### Security Headers
```typescript
// backend/src/main.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## Troubleshooting

### Common Deployment Issues
1. **Build failures**: Check Node.js version compatibility
2. **Environment variables**: Verify all required variables are set
3. **Database connections**: Check network security groups
4. **CORS errors**: Verify frontend URL in backend CORS config
5. **Authentication issues**: Check Cognito callback URLs

### Debug Commands
```bash
# Check service status
kubectl get pods
docker ps
aws ecs describe-services

# View logs
kubectl logs <pod-name>
docker logs <container-id>
aws logs tail /ecs/digilaw-backend
```