import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.bucket = process.env.WASABI_BUCKET || '';
    this.region = process.env.WASABI_REGION || 'us-east-1';

    const endpoint = process.env.WASABI_ENDPOINT || 'https://s3.wasabisys.com';

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: process.env.WASABI_ACCESS_KEY || '',
        secretAccessKey: process.env.WASABI_SECRET_KEY || '',
      },
      forcePathStyle: true, // Required for Wasabi
    });
  }

  /**
   * Generate a presigned URL for uploading an image
   * @param fileName - Original file name
   * @param contentType - MIME type of the file
   * @param expiresIn - URL expiration time in seconds (default: 300 = 5 minutes)
   * @returns Object containing the presigned URL and the key to store in database
   */
  async generateUploadPresignedUrl(
    fileName: string,
    contentType: string,
    expiresIn: number = 300,
  ): Promise<{ uploadUrl: string; key: string }> {
    // Generate a unique key for the file
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const key = `images/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return { uploadUrl, key };
  }

  /**
   * Generate a presigned URL for viewing/downloading an image
   * @param key - The S3 key (stored in database)
   * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Presigned URL for viewing the image
   */
  async generateViewPresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const viewUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return viewUrl;
  }

  /**
   * Upload an image directly to Wasabi (for backend proxy uploads)
   * @param fileBuffer - File buffer
   * @param fileName - Original file name
   * @param contentType - MIME type of the file
   * @returns The key of the uploaded file
   */
  async uploadImage(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    // Generate a unique key for the file
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const key = `images/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return key;
  }

  /**
   * Delete an image from Wasabi storage
   * @param key - The S3 key to delete
   */
  async deleteImage(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
