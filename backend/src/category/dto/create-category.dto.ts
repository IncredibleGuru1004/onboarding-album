import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Watches',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Category image (Wasabi key)',
    example: 'images/123e4567-e89b-12d3-a456-426614174000.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
