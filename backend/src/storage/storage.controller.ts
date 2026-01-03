import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { GenerateUploadUrlDto } from './dto/generate-upload-url.dto';
// import { GenerateViewUrlDto } from './dto/generate-view-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generate a presigned URL for uploading an image' })
  @ApiResponse({
    status: 201,
    description: 'Presigned upload URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        uploadUrl: {
          type: 'string',
          example:
            'https://s3.wasabisys.com/bucket/images/...?X-Amz-Algorithm=...',
        },
        key: {
          type: 'string',
          example: 'images/123e4567-e89b-12d3-a456-426614174000.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    const { uploadUrl, key } =
      await this.storageService.generateUploadPresignedUrl(
        dto.fileName,
        dto.contentType,
        dto.expiresIn,
      );

    return {
      uploadUrl,
      key,
    };
  }

  @Get('view-url')
  @ApiOperation({ summary: 'Generate a presigned URL for viewing an image' })
  @ApiQuery({
    name: 'key',
    required: true,
    description: 'The S3 key (stored in database)',
    example: 'images/123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  @ApiQuery({
    name: 'expiresIn',
    required: false,
    description: 'URL expiration time in seconds (default: 3600)',
    example: 3600,
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned view URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        viewUrl: {
          type: 'string',
          example:
            'https://s3.wasabisys.com/bucket/images/...?X-Amz-Algorithm=...',
        },
      },
    },
  })
  async generateViewUrl(
    @Query('key') key: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const expiresInSeconds = expiresIn ? parseInt(expiresIn, 10) : undefined;
    const viewUrl = await this.storageService.generateViewPresignedUrl(
      key,
      expiresInSeconds,
    );

    return {
      viewUrl,
    };
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload an image directly through the backend (avoids CORS)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'images/123e4567-e89b-12d3-a456-426614174000.jpg',
        },
        viewUrl: {
          type: 'string',
          example:
            'https://s3.wasabisys.com/bucket/images/...?X-Amz-Algorithm=...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new Error('No file provided');
    }

    const key = await this.storageService.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    // Generate presigned URL for viewing
    const viewUrl = await this.storageService.generateViewPresignedUrl(key);

    return {
      key,
      viewUrl,
    };
  }
}
