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
import { GetUser } from '../auth/decorators/get-user.decorator';

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
  create(
    @Body() createAuctionDto: CreateAuctionDto,
    @GetUser() user: { id: string },
  ) {
    // Automatically set userId from authenticated user
    return this.auctionService.create({
      ...createAuctionDto,
      userId: user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all auctions with cursor-based pagination' })
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
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items to fetch (default: 12)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (auction ID)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of auctions with pagination metadata',
  })
  findAll(
    @Query('categoryID') categoryID?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const parsedCursor = cursor ? parseInt(cursor, 10) : undefined;
    return this.auctionService.findAll(
      categoryID,
      userId,
      parsedLimit,
      parsedCursor,
    );
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently added auctions (up to 20 items)' })
  @ApiResponse({
    status: 200,
    description: 'List of recently added auctions',
  })
  findRecent() {
    return this.auctionService.findRecent();
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
