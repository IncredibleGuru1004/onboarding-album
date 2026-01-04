import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    // Enrich with presigned URL if it's a Wasabi key
    return this.enrichWithPresignedUrl(category);
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Enrich all categories with presigned URLs
    return Promise.all(
      categories.map((category) => this.enrichWithPresignedUrl(category)),
    );
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        auctions: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Enrich with presigned URL
    return this.enrichWithPresignedUrl(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id); // Check if category exists

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    // Enrich with presigned URL
    return this.enrichWithPresignedUrl(category);
  }

  async remove(id: string) {
    await this.findOne(id); // Check if category exists

    return this.prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Enrich category with presigned URL if image is a Wasabi key
   * @param category - Category object from database
   * @returns Category with imageUrl field (presigned URL or original URL)
   */
  private async enrichWithPresignedUrl(category: any): Promise<any> {
    // Check if image is a Wasabi key (starts with "images/")
    if (category.image && category.image.startsWith('images/')) {
      try {
        const presignedUrl = await this.storageService.generateViewPresignedUrl(
          category.image,
        );
        return {
          ...category,
          imageUrl: presignedUrl, // Add presigned URL
          image: category.image, // Keep the key for reference
        };
      } catch (error) {
        // If presigned URL generation fails, return original
        console.error('Failed to generate presigned URL:', error);
        return {
          ...category,
          imageUrl: category.image,
        };
      }
    }

    // For backward compatibility with old URLs or no image
    return {
      ...category,
      imageUrl: category.image || null,
    };
  }
}
