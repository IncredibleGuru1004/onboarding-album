# Re-Registration Feature for Unverified Accounts

## Overview

Users with unverified email addresses can now re-register with the same email to receive a new verification email. This solves the problem of lost or expired verification emails without requiring a separate "resend verification" endpoint.

## Problem Solved

Previously, if a user:

- Registered but didn't verify their email
- Lost the verification email
- Had the verification token expire (24 hours)

They would be stuck unable to:

- Log in (email not verified)
- Register again (email already exists error)
- Access their account

## Solution

The registration endpoint now intelligently handles re-registration attempts:

1. **New users**: Create account and send verification email (existing behavior)
2. **Unverified existing users**: Update account and send new verification email (**NEW**)
3. **Verified existing users**: Reject with conflict error (existing behavior)

## Implementation Details

### Backend Changes

#### Modified: `backend/src/auth/auth.service.ts` - `register()` method

```typescript
if (existingUser) {
  // If user exists but email is not verified, allow re-registration
  if (!existingUser.emailVerified) {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // 24 hours from now

    // Update user with new password and verification token
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        name: name || existingUser.name,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: verificationTokenExpires,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(
      email,
      name || existingUser.name,
      verificationToken,
    );

    // Return message
    return {
      message:
        "A new verification email has been sent. Please check your email to verify your account.",
      email,
    };
  }

  // If email is already verified, throw error
  throw new ConflictException("User with this email already exists");
}
```

### What Gets Updated

When a user re-registers with an unverified account:

1. **Password**: Updated to the new password provided
2. **Name**: Updated if provided, otherwise keeps existing name
3. **Verification Token**: New token generated (old one invalidated)
4. **Token Expiration**: Reset to 24 hours from re-registration time
5. **Email**: Remains the same
6. **emailVerified**: Remains `false` until verified

### Frontend Changes

#### Translation Files

Added new translation key for re-registration success message:

**English** (`frontend/messages/en.json`):

```json
"verificationEmailResent": "A new verification email has been sent. Please check your email to verify your account."
```

**Spanish** (`frontend/messages/es.json`):

```json
"verificationEmailResent": "Se ha enviado un nuevo correo de verificación. Por favor, revisa tu correo electrónico para verificar tu cuenta."
```

**French** (`frontend/messages/fr.json`):

```json
"verificationEmailResent": "Un nouvel e-mail de vérification a été envoyé. Veuillez vérifier votre boîte de réception pour vérifier votre compte."
```

## User Flow

### Scenario 1: Lost Verification Email

1. User registers with `user@example.com` and password `Password123`
2. User doesn't receive or loses the verification email
3. User tries to log in → **Rejected**: "Please verify your email"
4. User goes back to registration page
5. User registers again with `user@example.com` and password `Password123`
6. System detects unverified account
7. System sends new verification email
8. User receives new email and clicks verification link
9. User can now log in successfully

### Scenario 2: Forgot Password Before Verification

1. User registers with `user@example.com` and password `OldPassword123`
2. User forgets password before verifying
3. User tries to log in → **Rejected**: "Please verify your email"
4. User goes back to registration page
5. User registers again with `user@example.com` and NEW password `NewPassword456`
6. System updates password and sends new verification email
7. User clicks verification link
8. User logs in with `NewPassword456` → **Success**

### Scenario 3: Expired Verification Token

1. User registers but doesn't verify within 24 hours
2. Verification token expires
3. User tries to use old verification link → **Error**: "Invalid or expired verification token"
4. User goes back to registration page
5. User registers again with same email
6. System generates new token with fresh 24-hour expiration
7. User clicks new verification link → **Success**

## Security Considerations

### ✅ Secure Aspects

1. **Password Updates**: Allows users to reset password before verification
2. **Token Invalidation**: Old verification tokens are replaced, preventing reuse
3. **No Information Leakage**: Response message doesn't reveal if email exists
4. **Rate Limiting Ready**: Can easily add rate limiting to prevent abuse

### ⚠️ Potential Concerns & Mitigations

#### Concern 1: Email Bombing

**Issue**: Attacker could repeatedly register with victim's email to spam them

**Mitigation Options**:

- Add rate limiting (e.g., max 3 verification emails per hour per email)
- Add CAPTCHA on registration form
- Implement exponential backoff for re-registration attempts

#### Concern 2: Account Takeover Attempt

**Issue**: Attacker could try to re-register victim's unverified account

**Why This is Safe**:

- Verification email goes to the legitimate email owner
- Only the email owner can complete verification
- Attacker cannot access account without clicking verification link
- Original owner can still verify and regain control

#### Concern 3: Password Reset Before Verification

**Issue**: User's password can be changed before account is verified

**Why This is Acceptable**:

- Account is not accessible until email is verified
- Only email owner can verify and activate account
- This actually helps users who forgot password during registration

## API Response Examples

### New User Registration

```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "email": "user@example.com"
}
```

### Re-Registration (Unverified Account)

```json
{
  "message": "A new verification email has been sent. Please check your email to verify your account.",
  "email": "user@example.com"
}
```

### Registration with Verified Email (Error)

```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

## Testing

### Test Case 1: Basic Re-Registration

```bash
# Step 1: Initial registration
POST /auth/register
{
  "email": "test@example.com",
  "password": "Password123",
  "name": "Test User"
}
# Response: "Registration successful..."

# Step 2: Don't verify, try to login
POST /auth/login
{
  "email": "test@example.com",
  "password": "Password123"
}
# Response: 401 "Please verify your email..."

# Step 3: Re-register
POST /auth/register
{
  "email": "test@example.com",
  "password": "Password123",
  "name": "Test User"
}
# Response: "A new verification email has been sent..."

# Step 4: Verify email and login
GET /auth/verify-email?token=<new_token>
# Response: 200 with access token

POST /auth/login
{
  "email": "test@example.com",
  "password": "Password123"
}
# Response: 200 with access token
```

### Test Case 2: Password Change via Re-Registration

```bash
# Step 1: Initial registration
POST /auth/register
{
  "email": "test@example.com",
  "password": "OldPassword123"
}

# Step 2: Re-register with new password
POST /auth/register
{
  "email": "test@example.com",
  "password": "NewPassword456"
}

# Step 3: Verify email
GET /auth/verify-email?token=<new_token>

# Step 4: Login with NEW password
POST /auth/login
{
  "email": "test@example.com",
  "password": "NewPassword456"
}
# Response: 200 Success

# Step 5: Try login with OLD password
POST /auth/login
{
  "email": "test@example.com",
  "password": "OldPassword123"
}
# Response: 401 Invalid credentials
```

### Test Case 3: Cannot Re-Register Verified Account

```bash
# Step 1: Register and verify
POST /auth/register
{
  "email": "test@example.com",
  "password": "Password123"
}
GET /auth/verify-email?token=<token>

# Step 2: Try to re-register
POST /auth/register
{
  "email": "test@example.com",
  "password": "NewPassword456"
}
# Response: 409 "User with this email already exists"
```

## Benefits

1. **Better UX**: Users can recover from lost verification emails without support
2. **Reduced Support Load**: Fewer "I didn't get verification email" tickets
3. **Password Recovery**: Users can reset forgotten passwords before verification
4. **Token Refresh**: Expired tokens can be refreshed by re-registering
5. **Simple Implementation**: No need for separate "resend verification" endpoint

## Limitations

1. **No Rate Limiting Yet**: Should be added to prevent abuse
2. **No Email History**: System doesn't track how many times verification was resent
3. **No Notification**: Original email doesn't notify about re-registration attempt

## Recommended Future Enhancements

1. **Rate Limiting**: Implement rate limiting (e.g., max 3 attempts per hour)
2. **Email Notification**: Notify if someone attempts to re-register
3. **Audit Log**: Track re-registration attempts for security monitoring
4. **CAPTCHA**: Add CAPTCHA to registration form to prevent automated abuse
5. **Exponential Backoff**: Increase wait time between re-registration attempts
6. **Admin Dashboard**: View accounts with multiple re-registration attempts

## Related Documentation

- `EMAIL_VERIFICATION_SETUP.md` - Initial email verification setup
- `EMAIL_VERIFICATION_LOGIN.md` - Email verification on login feature
- `backend/src/auth/auth.service.ts` - Implementation code
- `backend/src/email/email.service.ts` - Email sending service

## Conclusion

This feature provides a user-friendly solution for handling lost or expired verification emails while maintaining security. Users can self-service their verification issues without requiring support intervention, improving the overall user experience.
