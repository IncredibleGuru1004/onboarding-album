import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AuctionService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createAuctionDto: CreateAuctionDto) {
    const data: Record<string, unknown> = {
      title: createAuctionDto.title,
      image: createAuctionDto.image, // This will be the Wasabi key
    };

    if (createAuctionDto.categoryID !== undefined) {
      data.categoryID = createAuctionDto.categoryID;
    }

    if (createAuctionDto.userId !== undefined) {
      data.userId = createAuctionDto.userId;
    }

    const auction = await this.prisma.auction.create({
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

    // Enrich with presigned URL if it's a Wasabi key
    return this.enrichWithPresignedUrl(auction);
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

    // Enrich items with presigned URLs
    const enrichedItems = await Promise.all(
      items.map((auction) => this.enrichWithPresignedUrl(auction)),
    );

    return {
      items: enrichedItems,
      nextCursor,
      hasMore,
    };
  }

  async findRecent() {
    const auctions = await this.prisma.auction.findMany({
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

    // Enrich with presigned URLs
    return Promise.all(
      auctions.map((auction) => this.enrichWithPresignedUrl(auction)),
    );
  }

  /**
   * Find all auctions for a specific user (no pagination)
   * Used for "My Auctions" page
   */
  async findAllByUser(userId: string) {
    const auctions = await this.prisma.auction.findMany({
      where: {
        userId: userId,
      },
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

    // Enrich with presigned URLs
    return Promise.all(
      auctions.map((auction) => this.enrichWithPresignedUrl(auction)),
    );
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

    // Enrich with presigned URL
    return this.enrichWithPresignedUrl(auction);
  }

  async update(id: number, updateAuctionDto: UpdateAuctionDto) {
    await this.findOne(id); // Check if auction exists

    const auction = await this.prisma.auction.update({
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

    // Enrich with presigned URL
    return this.enrichWithPresignedUrl(auction);
  }

  async remove(id: number) {
    await this.findOne(id); // Check if auction exists

    return this.prisma.auction.delete({
      where: { id },
    });
  }

  /**
   * Enrich auction with presigned URL if image is a Wasabi key
   * @param auction - Auction object from database
   * @returns Auction with imageUrl field (presigned URL or original URL)
   */
  private async enrichWithPresignedUrl(auction: any): Promise<any> {
    // Check if image is a Wasabi key (starts with "images/")
    if (auction.image && auction.image.startsWith('images/')) {
      try {
        const presignedUrl = await this.storageService.generateViewPresignedUrl(
          auction.image,
        );
        return {
          ...auction,
          imageUrl: presignedUrl, // Add presigned URL
          image: auction.image, // Keep the key for reference
        };
      } catch (error) {
        // If presigned URL generation fails, return original
        console.error('Failed to generate presigned URL:', error);
        return {
          ...auction,
          imageUrl: auction.image,
        };
      }
    }

    // For backward compatibility with old URLs
    return {
      ...auction,
      imageUrl: auction.image,
    };
  }
}
