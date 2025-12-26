import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({
    description: 'Auction title',
    example: 'Vintage Rolex Watch',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Auction image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'uuid-string',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryID?: string;

  @ApiProperty({
    description: 'User ID (owner of the auction)',
    example: 'uuid-string',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
