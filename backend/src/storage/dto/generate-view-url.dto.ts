import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateViewUrlDto {
  @ApiProperty({
    description: 'The S3 key (stored in database)',
    example: 'images/123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'URL expiration time in seconds (default: 3600)',
    example: 3600,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(60)
  @Max(86400)
  expiresIn?: number;
}
