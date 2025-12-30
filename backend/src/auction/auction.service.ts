import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async create(createAuctionDto: CreateAuctionDto) {
    const data: Record<string, unknown> = {
      title: createAuctionDto.title,
      image: createAuctionDto.image,
    };

    if (createAuctionDto.categoryID !== undefined) {
      data.categoryID = createAuctionDto.categoryID;
    }

    if (createAuctionDto.userId !== undefined) {
      data.userId = createAuctionDto.userId;
    }

    return this.prisma.auction.create({
      data: data as any,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(
    categoryID?: string,
    userId?: string,
    limit?: number,
    cursor?: number,
  ) {
    const where: any = {};

    if (categoryID) {
      where.categoryID = categoryID;
    }

    if (userId) {
      where.userId = userId;
    }

    const take = limit || 12; // Default limit
    const queryOptions: any = {
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: take + 1, // Fetch one extra to check if there are more
    };

    if (cursor) {
      queryOptions.cursor = {
        id: cursor,
      };
      queryOptions.skip = 1; // Skip the cursor item itself
    }

    const auctions = await this.prisma.auction.findMany(queryOptions);

    // Check if there are more items
    const hasMore = auctions.length > take;
    const items = hasMore ? auctions.slice(0, take) : auctions;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findRecent() {
    return this.prisma.auction.findMany({
      take: 20,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }

    return auction;
  }

  async update(id: number, updateAuctionDto: UpdateAuctionDto) {
    await this.findOne(id); // Check if auction exists

    return this.prisma.auction.update({
      where: { id },
      data: updateAuctionDto,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if auction exists

    return this.prisma.auction.delete({
      where: { id },
    });
  }
}
