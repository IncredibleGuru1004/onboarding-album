export interface Category {
  id: string;
  title: string;
  image?: string | null;
  imageUrl?: string | null; // Presigned URL for display
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  title: string;
  image?: string;
}

export interface UpdateCategoryDto {
  title?: string;
  image?: string;
}
