# Registration & Verification Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER REGISTRATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────────┐
│ User visits         │
│ /register page      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ User enters:        │
│ - Email             │
│ - Password          │
│ - Name (optional)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ POST /auth/register │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ Does email   │
    │ exist in DB? │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
    YES         NO
     │           │
     ▼           ▼
┌────────────┐  ┌──────────────────┐
│ Is email   │  │ Create new user  │
│ verified?  │  │ - Hash password  │
└─────┬──────┘  │ - Generate token │
      │         │ - emailVerified: │
  ┌───┴───┐     │   false          │
  │       │     └────────┬─────────┘
 YES     NO              │
  │       │              │
  │       ▼              │
  │  ┌────────────────┐  │
  │  │ Update user:   │  │
  │  │ - New password │  │
  │  │ - New token    │  │
  │  │ - Update name  │  │
  │  └────────┬───────┘  │
  │           │          │
  │           ▼          │
  │  ┌────────────────┐  │
  │  │ Send new       │◄─┘
  │  │ verification   │
  │  │ email          │
  │  └────────┬───────┘
  │           │
  │           ▼
  │  ┌────────────────────────────┐
  │  │ Return: "A new             │
  │  │ verification email has     │
  │  │ been sent..."              │
  │  └────────┬───────────────────┘
  │           │
  ▼           ▼
┌──────────────────────┐
│ Return 409 Error:    │
│ "User with this      │
│ email already exists"│
└──────────────────────┘
           │
           ▼
         END


┌─────────────────────────────────────────────────────────────────────────────┐
│                      EMAIL VERIFICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

User receives email
  │
  ▼
┌──────────────────────┐
│ User clicks          │
│ verification link    │
│ (contains token)     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ GET /verify-email    │
│ ?token=xxxxx         │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │ Is token     │
    │ valid and    │
    │ not expired? │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
    YES         NO
     │           │
     ▼           ▼
┌────────────┐  ┌──────────────────┐
│ Update DB: │  │ Return error:    │
│ - emailVer-│  │ "Invalid or      │
│   ified:   │  │ expired token"   │
│   true     │  └──────────────────┘
│ - Clear    │
│   token    │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Generate   │
│ JWT token  │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Redirect   │
│ to         │
│ /dashboard │
└────────────┘
      │
      ▼
    END


┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────┘

User visits /login
  │
  ▼
┌──────────────────────┐
│ User enters:         │
│ - Email              │
│ - Password           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ POST /auth/login     │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │ Does user    │
    │ exist?       │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
    YES         NO
     │           │
     ▼           ▼
┌────────────┐  ┌──────────────────┐
│ Has        │  │ Return 401:      │
│ password?  │  │ "Invalid         │
└─────┬──────┘  │ credentials"     │
      │         └──────────────────┘
  ┌───┴───┐
  │       │
 YES     NO
  │       │
  │       ▼
  │  ┌──────────────────┐
  │  │ Return 401:      │
  │  │ "Use social      │
  │  │ login"           │
  │  └──────────────────┘
  │
  ▼
┌────────────┐
│ Is         │
│ password   │
│ correct?   │
└─────┬──────┘
      │
  ┌───┴───┐
  │       │
 YES     NO
  │       │
  │       ▼
  │  ┌──────────────────┐
  │  │ Return 401:      │
  │  │ "Invalid         │
  │  │ credentials"     │
  │  └──────────────────┘
  │
  ▼
┌────────────┐
│ Is email   │
│ verified?  │
└─────┬──────┘
      │
  ┌───┴───┐
  │       │
 YES     NO
  │       │
  │       ▼
  │  ┌──────────────────────────┐
  │  │ Return 401:              │
  │  │ "Please verify your      │
  │  │ email before logging in. │
  │  │ Check your inbox for     │
  │  │ the verification link."  │
  │  └──────────────────────────┘
  │           │
  │           ▼
  │      ┌────────────────┐
  │      │ User can:      │
  │      │ 1. Check email │
  │      │ 2. Re-register │
  │      │    to get new  │
  │      │    email       │
  │      └────────────────┘
  │
  ▼
┌────────────┐
│ Generate   │
│ JWT token  │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Return     │
│ token +    │
│ user data  │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Redirect   │
│ to         │
│ /dashboard │
└────────────┘
      │
      ▼
    END


┌─────────────────────────────────────────────────────────────────────────────┐
│                    RE-REGISTRATION SCENARIO                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Timeline:

Day 1, 10:00 AM
├─ User registers with test@example.com
├─ Verification email sent (Token A)
└─ Token A expires: Day 2, 10:00 AM

Day 1, 11:00 AM
├─ User tries to login
└─ ❌ Rejected: "Please verify your email"

Day 1, 12:00 PM
├─ User realizes they lost the email
├─ User goes back to /register
├─ User registers again with test@example.com
├─ System detects: email exists + emailVerified = false
├─ System updates password (if changed)
├─ System generates new token (Token B)
├─ Token A is invalidated (replaced by Token B)
├─ New verification email sent (Token B)
└─ Token B expires: Day 2, 12:00 PM

Day 1, 12:05 PM
├─ User clicks verification link in new email
├─ Token B validated
├─ emailVerified set to true
└─ ✅ User redirected to dashboard

Day 1, 12:10 PM
├─ User tries to login
└─ ✅ Success! User logged in


┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE STATE CHANGES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Initial Registration:
┌─────────────────────────────────────────────────────────────────────┐
│ User Table                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ email: test@example.com                                             │
│ password: $2b$10$abc...xyz (hashed "Password123")                   │
│ name: "John Doe"                                                    │
│ emailVerified: false                                                │
│ emailVerificationToken: "abc123def456..."                           │
│ emailVerificationTokenExpires: 2024-01-02T10:00:00Z                │
│ googleId: null                                                      │
└─────────────────────────────────────────────────────────────────────┘

After Re-Registration (with new password):
┌─────────────────────────────────────────────────────────────────────┐
│ User Table                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ email: test@example.com                     [UNCHANGED]             │
│ password: $2b$10$xyz...abc (hashed "NewPass456")  [UPDATED]        │
│ name: "John Doe"                            [UNCHANGED]             │
│ emailVerified: false                        [UNCHANGED]             │
│ emailVerificationToken: "xyz789uvw012..."   [UPDATED - NEW TOKEN]  │
│ emailVerificationTokenExpires: 2024-01-02T12:00:00Z [UPDATED]      │
│ googleId: null                              [UNCHANGED]             │
└─────────────────────────────────────────────────────────────────────┘

After Email Verification:
┌─────────────────────────────────────────────────────────────────────┐
│ User Table                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ email: test@example.com                     [UNCHANGED]             │
│ password: $2b$10$xyz...abc                  [UNCHANGED]             │
│ name: "John Doe"                            [UNCHANGED]             │
│ emailVerified: true                         [UPDATED]               │
│ emailVerificationToken: null                [CLEARED]               │
│ emailVerificationTokenExpires: null         [CLEARED]               │
│ googleId: null                              [UNCHANGED]             │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    DECISION TREE SUMMARY                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Registration Attempt
        │
        ▼
    Email exists?
        │
    ┌───┴───┐
   NO      YES
    │       │
    │       ▼
    │   Email verified?
    │       │
    │   ┌───┴───┐
    │  NO      YES
    │   │       │
    │   │       ▼
    │   │   ❌ 409 Conflict
    │   │   "User exists"
    │   │
    │   ▼
    │  ✅ Update account
    │     Send new email
    │     "New verification
    │      email sent"
    │
    ▼
✅ Create account
   Send email
   "Registration
    successful"
```

## Key Points

1. **Three Registration Outcomes**:
   - New user → Create account
   - Unverified existing user → Update account and resend email
   - Verified existing user → Reject with error

2. **Security Features**:
   - Old verification tokens are invalidated when new ones are generated
   - Passwords are always hashed
   - Only email owner can complete verification
   - Verification required before login

3. **User Benefits**:
   - Can recover from lost verification emails
   - Can update password before verification
   - Can refresh expired tokens
   - Self-service solution (no support needed)

4. **Token Lifecycle**:
   - Generated at registration
   - Valid for 24 hours
   - Invalidated when new token is generated (re-registration)
   - Cleared after successful verification
