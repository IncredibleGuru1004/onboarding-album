# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth credentials for your application.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top of the page
4. Click **"New Project"**
5. Enter a project name (e.g., "Onboarding Album")
6. Click **"Create"**
7. Wait for the project to be created, then select it from the dropdown

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Google Identity Services API"**
3. Click on it and click **"Enable"**

**Note:** Google+ API is deprecated, but you can also use:

- **Google Identity Services API** (recommended for new projects)
- Or just enable **OAuth consent screen** which will automatically enable necessary APIs

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account, then choose "Internal")
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Your app name (e.g., "Onboarding Album")
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **"Scopes"** page, click **"Add or Remove Scopes"**
   - Add: `email`, `profile`, `openid`
7. Click **"Save and Continue"**
8. On the **"Test users"** page (if in testing mode), you can add test users
9. Click **"Save and Continue"**
10. Review and click **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If prompted, select **"Web application"** as the application type
5. Fill in the form:
   - **Name**: Give it a name (e.g., "Onboarding Album Web Client")
   - **Authorized JavaScript origins**:
     - For development: `http://localhost:3000`
     - For production: Your production backend URL (e.g., `https://yourdomain.com`)
   - **Authorized redirect URIs**:
     - For development: `http://localhost:3000/auth/google/callback`
     - For production: `https://yourdomain.com/auth/google/callback`
6. Click **"Create"**

## Step 5: Copy Your Credentials

After creating the OAuth client, a popup will appear with:

- **Your Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Your Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

**Important:** Copy these immediately as the Client Secret will only be shown once!

## Step 6: Add to Your Environment Variables

Add these to your backend `.env` file:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# OAuth Callback URL (should match what you entered in Google Console)
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Backend and Frontend URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## Step 7: For Production

When deploying to production:

1. Go back to Google Cloud Console > Credentials
2. Edit your OAuth client
3. Add your production URLs:
   - **Authorized JavaScript origins**: `https://your-production-backend.com`
   - **Authorized redirect URIs**: `https://your-production-backend.com/auth/google/callback`
4. Update your production environment variables with the same credentials

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

- Make sure the redirect URI in your `.env` file exactly matches what you entered in Google Console
- Check for trailing slashes, http vs https, and port numbers

### "Error 403: access_denied"

- Your app might be in testing mode. Add test users in OAuth consent screen
- Or publish your app (requires verification for sensitive scopes)

### Can't find Client Secret

- If you lost it, you'll need to create a new OAuth client
- Go to Credentials > Your OAuth client > Delete and create a new one

## Security Notes

- **Never commit** your `.env` file to version control
- Keep your Client Secret secure
- Use different credentials for development and production
- Regularly rotate your credentials if compromised
