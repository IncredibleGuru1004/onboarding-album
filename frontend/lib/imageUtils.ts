/**
 * Utility functions for handling Wasabi image URLs
 */

/**
 * Get the display URL for an image
 * Uses imageUrl (presigned URL) if available, otherwise falls back to image
 * If image is a Wasabi key, fetches a presigned URL
 */
export async function getImageUrl(
  image: string,
  imageUrl?: string,
): Promise<string> {
  // If presigned URL is already provided, use it
  if (imageUrl) {
    return imageUrl;
  }

  // If image is a Wasabi key (starts with "images/"), fetch presigned URL
  if (image && image.startsWith("images/")) {
    try {
      const response = await fetch(
        `/api/storage/view-url?key=${encodeURIComponent(image)}`,
      );
      if (response.ok) {
        const data = await response.json();
        return data.viewUrl;
      }
    } catch (error) {
      console.error("Failed to get presigned URL:", error);
    }
  }

  // Fallback to original image (for legacy URLs or if presigned URL fails)
  return image;
}

/**
 * Check if an image is a Wasabi key
 */
export function isWasabiKey(image: string): boolean {
  return !!(image && image.startsWith("images/"));
}
