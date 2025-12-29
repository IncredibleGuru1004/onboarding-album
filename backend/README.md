# Backend - Image Gallery API

## Overview

This is the backend service for the Image Gallery Site, built as part of a 15-day onboarding course. The backend provides a RESTful API for managing images, user authentication, and cloud storage integration.

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Authentication**: JWT & Google OAuth
- **Email Verification**: Nodemailer (SMTP)
- **Cloud Storage**: Wasabi (signed URL method)

## Features

### Authentication

- JWT-based authentication
- Google OAuth integration
- Email verification using Nodemailer (SMTP)

### Image Management

- Image CRUD operations
- Cloud storage integration with Wasabi
- Signed URL generation for secure uploads

### API Features

- RESTful API design
- Swagger/OpenAPI documentation
- Infinite scroll support for image listings

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- Docker (optional, for containerization)
- Wasabi account credentials

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following environment variables:

- Database connection (MySQL)
- JWT secret keys
- Google OAuth credentials
- Wasabi storage credentials
- SMTP email credentials (for email verification)

3. Set up the database:

```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

4. Start the development server:

```bash
npm run start:dev
```

## Docker Setup

Build and run with Docker:

```bash
# Build the image
docker build -t image-gallery-backend .

# Run the container
docker run -p 3000:3000 image-gallery-backend
```

Or use Docker Compose:

```bash
docker-compose up
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api
```

## Project Structure

```
backend/
├── src/
│   ├── auth/          # Authentication module (JWT, OAuth)
│   ├── images/        # Image CRUD operations
│   ├── users/         # User management
│   ├── storage/       # Cloud storage integration (Wasabi)
│   ├── email/         # Email verification
│   └── common/        # Shared utilities
├── prisma/
│   └── schema.prisma  # Database schema
└── docker/
    └── Dockerfile     # Docker configuration
```

## Development

### Running the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline includes:

- Automated testing
- Code quality checks
- Docker image building
- Deployment to staging/production

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="24h"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

# Wasabi Storage
WASABI_ACCESS_KEY="your-access-key"
WASABI_SECRET_KEY="your-secret-key"
WASABI_BUCKET="your-bucket-name"
WASABI_REGION="your-region"
WASABI_ENDPOINT="https://s3.wasabisys.com"

# SMTP Email Configuration (for email verification)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"  # Gmail App Password (not regular password)
SMTP_FROM_NAME="Onboarding Album"  # Optional: Display name for emails

# Frontend URL (for email verification links)
FRONTEND_URL="http://localhost:3001"
```

## Additional Learning Resources

### Infrastructure (Extra Catch-up)

- AWS ECS & VM instances & IAM
- Serverless:
  - AWS Lambda & API Gateway & AppSync
  - Google Cloud Functions
  - AWS Fargate & GCP Cloud Run
- Infrastructure as Code:
  - Terraform
  - AWS CDK

### Backend Architecture Patterns

- MVC (Model-View-Controller)
- DDD (Domain-Driven Design)
- Clean Architecture (Golang reference)

## License

This project is part of an onboarding course.
