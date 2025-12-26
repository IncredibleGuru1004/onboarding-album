import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 'uuid',
      email: 'user@example.com',
      name: 'John Doe',
      emailVerified: false,
    },
  })
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
  };
}
