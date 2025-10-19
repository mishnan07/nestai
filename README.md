# Digilaw AI - Legal Assistant Platform

A comprehensive web application providing AI-powered legal assistance with AWS Cognito authentication, Next.js frontend, and NestJS backend.

## Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: NestJS with TypeORM and PostgreSQL
- **Authentication**: AWS Cognito with social login support
- **Database**: PostgreSQL

## Features

### Authentication Flow
- Welcome page with signup/login options
- Role-based registration (Lawyer, Law Student, Common Citizen)
- Email/Phone signup with verification
- Google OAuth integration
- Phone number verification with OTP

### Main Application
- ChatGPT-like interface for legal queries
- Role-based user experience
- Responsive design for mobile and desktop

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- AWS Account with Cognito setup

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure environment variables
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run start:dev
```

### Database Setup
```sql
CREATE DATABASE digilaw;
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=digilaw

AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
```

## AWS Cognito Setup

### User Pool Configuration
1. Create User Pool with email/phone verification
2. Configure password policies (min 8 characters)
3. Enable Google OAuth provider
4. Set callback URL: `http://localhost:3000/auth/social-callback`
5. Configure user attributes: email, name, phone_number

### App Client Settings
- Auth flows: USER_PASSWORD_AUTH, REFRESH_TOKEN_AUTH
- OAuth flows: Authorization code grant
- OAuth scopes: email, openid, profile
- Generate client secret: NO

## API Endpoints

### Users
- `POST /api/users/profile` - Create user profile
- `GET /api/users/profile/:sub` - Get user by Cognito sub
- `PATCH /api/users/profile/:sub` - Update user profile
- `PATCH /api/users/verify-phone/:sub` - Mark phone as verified

### Auth
- `GET /api/auth/social-callback` - Handle OAuth callbacks

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```
Access at: http://localhost:3000

### Backend Development
```bash
cd backend
npm run start:dev
```
API available at: http://localhost:3001

## Project Structure

```
digilaw-ai/
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── define-role/
│   │   │   ├── signup/
│   │   │   ├── login/
│   │   │   ├── verify-phone/
│   │   │   ├── complete-profile/
│   │   │   └── social-callback/
│   │   ├── chat/
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   └── ui/
│   ├── lib/
│   └── types/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   └── database/
│   └── package.json
└── README.md
```

## Deployment

### Local Development
1. Start PostgreSQL database
2. Run backend: `npm run start:dev`
3. Run frontend: `npm run dev`

### Production Deployment
- Frontend: Deploy to Vercel/Netlify
- Backend: Deploy to AWS ECS/EC2
- Database: AWS RDS PostgreSQL

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

Private - All rights reserved