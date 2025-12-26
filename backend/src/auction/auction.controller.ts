import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new auction' })
  @ApiResponse({
    status: 201,
    description: 'Auction successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(createAuctionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all auctions' })
  @ApiQuery({
    name: 'categoryID',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all auctions',
  })
  findAll(
    @Query('categoryID') categoryID?: string,
    @Query('userId') userId?: string,
  ) {
    return this.auctionService.findAll(categoryID, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an auction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auction details',
  })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auctionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an auction' })
  @ApiResponse({
    status: 200,
    description: 'Auction successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an auction' })
  @ApiResponse({
    status: 204,
    description: 'Auction successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.auctionService.remove(id);
  }
}
