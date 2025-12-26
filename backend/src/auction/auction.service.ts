import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async create(createAuctionDto: CreateAuctionDto) {
    return this.prisma.auction.create({
      data: {
        title: createAuctionDto.title,
        image: createAuctionDto.image,
        categoryID: createAuctionDto.categoryID,
        userId: createAuctionDto.userId,
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
    });
  }

  async findAll(categoryID?: string, userId?: string) {
    const where: any = {};

    if (categoryID) {
      where.categoryID = categoryID;
    }

    if (userId) {
      where.userId = userId;
    }

    return this.prisma.auction.findMany({
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
