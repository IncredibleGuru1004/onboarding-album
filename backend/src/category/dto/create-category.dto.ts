import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Watches',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
