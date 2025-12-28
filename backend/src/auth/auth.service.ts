import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password (for OAuth users)
    if (!user.password) {
      throw new UnauthorizedException(
        'This account was created with social login. Please use social login to sign in.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });

    return user;
  }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<AuthResponseDto> {
    const { googleId, email, name } = googleUser;

    // Check if user exists by googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });

    // If not found by googleId, check by email
    if (!user) {
      const userByEmail = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          googleId: true,
        },
      });

      // If user exists but doesn't have googleId, update it
      if (userByEmail && !userByEmail.googleId) {
        user = await this.prisma.user.update({
          where: { email },
          data: { googleId },
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
          },
        });
      } else if (userByEmail) {
        user = {
          id: userByEmail.id,
          email: userByEmail.email,
          name: userByEmail.name,
          emailVerified: userByEmail.emailVerified,
        };
      }
    }

    // If user still doesn't exist, create a new one
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          name: name || null,
          emailVerified: true, // Google emails are verified
        },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
        },
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }
}
