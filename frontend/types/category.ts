export interface Category {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  title: string;
}

export interface UpdateCategoryDto {
  title?: string;
}
