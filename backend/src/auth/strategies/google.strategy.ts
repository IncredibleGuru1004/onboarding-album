import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const callbackPath = '/auth/google/callback';
    const callbackURL =
      process.env.GOOGLE_CALLBACK_URL || `${backendUrl}${callbackPath}`;

    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientID || !clientSecret) {
      throw new Error(
        'Google OAuth credentials are missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // Construct name from givenName and familyName, or use displayName
    let fullName = '';
    if (name) {
      if (name.givenName && name.familyName) {
        fullName = `${name.givenName} ${name.familyName}`;
      } else if (name.displayName) {
        fullName = name.displayName;
      }
    }

    const user = {
      googleId: id,
      email: emails?.[0]?.value || '',
      name: fullName || null,
      picture: photos?.[0]?.value || null,
      accessToken,
    };

    done(null, user);
  }
}
