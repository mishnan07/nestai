# Digilaw AI - Setup Instructions

## Quick Start Guide

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- AWS Account with Cognito configured
- Git installed

### 2. Clone and Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd digilaw-ai

# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment Configuration

#### Frontend Environment (.env.local)
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local` with your values:
```
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=digilaw

AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE digilaw;
CREATE USER digilaw_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE digilaw TO digilaw_user;
\q
```

### 5. AWS Cognito Setup

Follow the detailed guide in `COGNITO_SETUP.md` to:
- Create User Pool
- Configure OAuth providers (Google)
- Set up app client
- Configure callback URLs

### 6. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
Backend will run on: http://localhost:3001

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### 7. Test the Application

1. Open http://localhost:3000
2. Click "Sign Up with Email"
3. Select a role (Lawyer/Student/Citizen)
4. Fill the signup form
5. Verify phone number (demo OTP: 123456)
6. Access the chat interface

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run start:dev    # Start with hot reload
npm run build        # Build TypeScript
npm run start:prod   # Start production build
```

### Database Operations
```bash
# View database tables
psql -U digilaw_user -d digilaw -c "\dt"

# Check user records
psql -U digilaw_user -d digilaw -c "SELECT * FROM users;"
```

## Project Structure

```
digilaw-ai/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   │   ├── auth/           # Authentication pages
│   │   └── chat/           # Chat interface
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and API clients
│   └── types/             # TypeScript definitions
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   └── database/      # Database configuration
│   └── package.json
├── COGNITO_SETUP.md       # AWS Cognito setup guide
├── DATABASE_SETUP.md      # Database setup guide
├── DEPLOYMENT.md          # Deployment instructions
└── README.md              # Project overview
```

## Common Issues and Solutions

### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and credentials are correct.

### 2. Cognito Configuration Error
```
Error: User pool does not exist
```
**Solution**: Verify Cognito User Pool ID and region in environment variables.

### 3. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check backend CORS configuration allows frontend origin.

### 4. Build Errors
```
Module not found: Can't resolve '@/components/...'
```
**Solution**: Ensure TypeScript path mapping is configured correctly.

## API Testing

### Test User Creation
```bash
curl -X POST http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "cognitoSub": "test-123",
    "email": "test@example.com",
    "name": "Test User",
    "phoneNumber": "9876543210",
    "state": "Maharashtra",
    "city": "Mumbai",
    "role": "citizen"
  }'
```

### Test User Retrieval
```bash
curl http://localhost:3001/api/users/profile/test-123
```

## Next Steps

1. **Configure AWS Cognito** following `COGNITO_SETUP.md`
2. **Set up Google OAuth** for social authentication
3. **Customize UI/UX** according to your brand
4. **Add real AI integration** for chat functionality
5. **Set up monitoring** and logging
6. **Deploy to production** using `DEPLOYMENT.md`

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the detailed setup guides
3. Check application logs for error details
4. Ensure all environment variables are correctly set

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Database Changes**: Backend uses TypeORM synchronize in development
3. **Environment Variables**: Restart servers after changing environment variables
4. **Debugging**: Use browser dev tools for frontend, console logs for backend
5. **Testing**: Test authentication flow with different user roles