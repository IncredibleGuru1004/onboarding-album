import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateUploadUrlDto {
  @ApiProperty({
    description: 'Original file name',
    example: 'my-image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({
    description: 'URL expiration time in seconds (default: 300)',
    example: 300,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(60)
  @Max(3600)
  expiresIn?: number;
}
