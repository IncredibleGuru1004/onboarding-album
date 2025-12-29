# Email Verification Implementation Guide

## Overview

Email verification has been successfully implemented using Nodemailer. This feature allows users to verify their email addresses after registration.

## What Was Implemented

### Backend Changes

1. **Package Dependencies**
   - Added `nodemailer` and `@types/nodemailer` to `package.json`

2. **Database Schema Updates**
   - Added `emailVerificationToken` field to User model
   - Added `emailVerificationTokenExpires` field to User model
   - These fields store the verification token and its expiration time (24 hours)

3. **Email Service Module** (`backend/src/email/`)
   - Created `EmailService` with nodemailer configuration
   - Implements `sendVerificationEmail()` method
   - Includes HTML email template with verification link
   - Supports SMTP configuration via environment variables

4. **Auth Service Updates**
   - Modified `register()` to generate verification token and send email
   - Added `verifyEmail()` method to verify tokens
   - Added `resendVerificationEmail()` method for resending verification emails

5. **Auth Controller Updates**
   - Added `POST /auth/verify-email` endpoint (with body)
   - Added `GET /auth/verify-email?token=...` endpoint (for email links)
   - Added `POST /auth/resend-verification` endpoint (requires authentication)

### Frontend Changes

1. **SignupForm Component**
   - Updated to show success message about email verification
   - Displays notification that verification email has been sent

2. **Verification Page** (`frontend/app/[locale]/(auth)/verify-email/page.tsx`)
   - New page to handle email verification
   - Shows loading, success, and error states
   - Automatically redirects to login after successful verification

3. **Middleware Updates**
   - Added `/verify-email` to public paths (no authentication required)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install `nodemailer` and `@types/nodemailer`.

### 2. Update Database Schema

Run Prisma migrations to add the new fields:

```bash
cd backend
npx prisma migrate dev --name add_email_verification
npx prisma generate
```

### 3. Configure SMTP Settings

Add the following environment variables to your `backend/.env` file:

```env
# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"  # Gmail App Password (not regular password)
SMTP_FROM_NAME="Onboarding Album"  # Optional: Display name for emails

# Frontend URL (for email verification links)
FRONTEND_URL="http://localhost:3001"
```

### 4. Gmail App Password Setup (if using Gmail)

1. Go to your Google Account settings
2. Enable 2-Step Verification (required for App Passwords)
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password as `SMTP_PASS`

**Note:** For other email providers (SendGrid, Mailgun, etc.), adjust the SMTP settings accordingly.

### 5. Alternative Email Providers

#### SendGrid

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

#### Mailgun

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-username"
SMTP_PASS="your-mailgun-password"
```

#### AWS SES

```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-aws-access-key"
SMTP_PASS="your-aws-secret-key"
```

## API Endpoints

### Verify Email (POST)

```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

### Verify Email (GET) - For email links

```
GET /api/auth/verify-email?token=verification-token-from-email
```

### Resend Verification Email

```
POST /api/auth/resend-verification
Authorization: Bearer <jwt-token>
```

## User Flow

1. **Registration**
   - User registers with email and password
   - System generates verification token (valid for 24 hours)
   - Verification email is sent automatically
   - User sees success message with email verification notice

2. **Email Verification**
   - User clicks verification link in email
   - Link points to `/verify-email?token=...`
   - Frontend calls backend API to verify token
   - On success, user is redirected to login page
   - On failure, error message is shown

3. **Resend Verification**
   - If user didn't receive email or token expired
   - User can call resend endpoint (requires authentication)
   - New verification email is sent with new token

## Testing

1. **Test Registration**

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

2. **Check Email**
   - Check the inbox of the registered email
   - Click the verification link

3. **Test Verification Endpoint**
   ```bash
   curl -X POST http://localhost:3000/api/auth/verify-email \
     -H "Content-Type: application/json" \
     -d '{"token":"your-verification-token"}'
   ```

## Troubleshooting

### Email Not Sending

- Check SMTP credentials are correct
- Verify SMTP_HOST and SMTP_PORT settings
- For Gmail, ensure App Password is used (not regular password)
- Check server logs for error messages

### Token Not Working

- Tokens expire after 24 hours
- Each token can only be used once
- Ensure token is copied correctly from email

### Prisma Errors

- Run `npx prisma generate` after schema changes
- Ensure migrations are applied: `npx prisma migrate dev`

## Security Considerations

1. **Token Expiration**: Tokens expire after 24 hours
2. **One-Time Use**: Tokens are cleared after successful verification
3. **Secure Generation**: Tokens are generated using crypto.randomBytes()
4. **HTTPS**: Use HTTPS in production for secure token transmission

## Next Steps

- [ ] Install dependencies: `npm install` in backend
- [ ] Run database migrations: `npx prisma migrate dev`
- [ ] Configure SMTP settings in `.env`
- [ ] Test email sending with a real email address
- [ ] Update frontend translations if needed (for i18n support)
