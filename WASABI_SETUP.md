# Wasabi Image Upload Setup

This document describes the Wasabi image upload implementation for the Onboarding Album application.

## Overview

The application now uses Wasabi (S3-compatible storage) for image uploads with presigned URLs. This ensures that:

- Images are stored securely in Wasabi
- Images remain private (free Wasabi account)
- Images are accessed via presigned URLs that expire after a set time
- No direct public access to images

## Backend Implementation

### Dependencies

The following packages have been added to `backend/package.json`:

- `@aws-sdk/client-s3` - AWS SDK for S3-compatible storage
- `@aws-sdk/s3-request-presigner` - For generating presigned URLs

**Install dependencies:**

```bash
cd backend
npm install
```

### Environment Variables

Add the following environment variables to your `.env` file in the backend:

```env
# Wasabi Storage Configuration
WASABI_ACCESS_KEY=your-access-key
WASABI_SECRET_KEY=your-secret-key
WASABI_BUCKET=your-bucket-name
WASABI_REGION=us-east-1  # or your Wasabi region
WASABI_ENDPOINT=https://s3.wasabisys.com  # or your Wasabi endpoint
```

### Storage Module

The storage module (`backend/src/storage/`) provides:

1. **StorageService** - Handles Wasabi operations:
   - `generateUploadPresignedUrl()` - Generates presigned URL for uploading
   - `generateViewPresignedUrl()` - Generates presigned URL for viewing
   - `deleteImage()` - Deletes an image from Wasabi

2. **StorageController** - API endpoints:
   - `POST /storage/upload-url` - Get presigned URL for upload (requires authentication)
   - `GET /storage/view-url?key=...` - Get presigned URL for viewing

### Auction Service Updates

The auction service has been updated to:

- Store Wasabi keys (e.g., `images/uuid.jpg`) in the database instead of full URLs
- Automatically enrich auction responses with presigned URLs via `imageUrl` field
- Maintain backward compatibility with legacy image URLs

## Frontend Implementation

### API Routes

Two new API routes have been created:

1. **`/api/storage/upload-url`** - Proxy to backend for getting upload presigned URLs
2. **`/api/storage/view-url`** - Proxy to backend for getting view presigned URLs

### ImageUpload Component

The `ImageUpload` component has been updated to:

1. Get a presigned upload URL from the backend
2. Upload the file directly to Wasabi using the presigned URL
3. Get a presigned view URL for preview
4. Store the Wasabi key (not the full URL) in the parent component

### Image Display

Components that display images have been updated to use presigned URLs:

- `GalleryCard` - Uses `imageUrl` if available, falls back to `image`
- `Modal` - Uses presigned URLs for displaying auction images
- `imageUtils.ts` - Utility functions for handling Wasabi keys and presigned URLs

### Type Updates

The `Auction` type now includes:

```typescript
{
  image: string;      // Wasabi key or legacy URL
  imageUrl?: string;   // Presigned URL (from backend)
}
```

## How It Works

### Upload Flow

1. User selects an image in the `ImageUpload` component
2. Frontend requests a presigned upload URL from `/api/storage/upload-url`
3. Backend generates a presigned URL and returns it with a unique key
4. Frontend uploads the file directly to Wasabi using the presigned URL
5. Frontend gets a presigned view URL for preview
6. Frontend stores the Wasabi key (e.g., `images/uuid.jpg`) in the form
7. When creating/updating an auction, the Wasabi key is sent to the backend
8. Backend stores the key in the database

### Display Flow

1. When fetching auctions, the backend automatically enriches each auction with a presigned `imageUrl`
2. Frontend components use `imageUrl` if available, otherwise fall back to `image`
3. If `image` is a Wasabi key and `imageUrl` is not provided, the frontend fetches a presigned URL on-demand
4. Presigned URLs expire after 1 hour (configurable)

## Testing

### Backend

1. Ensure all environment variables are set
2. Start the backend server:

   ```bash
   cd backend
   npm run start:dev
   ```

3. Test the endpoints:
   - `POST /storage/upload-url` (requires JWT token)
   - `GET /storage/view-url?key=images/test.jpg`

### Frontend

1. Start the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

2. Test image upload:
   - Open the "Add Auction" modal
   - Select an image
   - The image should upload to Wasabi and display a preview
   - Create the auction
   - Verify the image displays correctly in the gallery

## Notes

- Presigned URLs expire after a set time (default: 5 minutes for upload, 1 hour for view)
- Images are stored with unique UUIDs to prevent conflicts
- The system maintains backward compatibility with legacy image URLs
- All Wasabi operations use the S3-compatible API

## Troubleshooting

### Images not uploading

1. Check Wasabi credentials in `.env`
2. Verify bucket name and region are correct
3. Check browser console for errors
4. Verify backend is running and accessible

### Images not displaying

1. Check if presigned URLs are being generated correctly
2. Verify the Wasabi key is stored correctly in the database
3. Check browser network tab for failed requests
4. Ensure presigned URLs haven't expired (they expire after 1 hour)

### CORS Issues

If you encounter CORS issues, ensure:

- Wasabi bucket CORS settings allow your frontend domain
- Backend CORS settings include your frontend URL
