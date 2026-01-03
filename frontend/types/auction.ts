import { Category } from "./category";

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Auction {
  id: number;
  title: string;
  image: string; // Wasabi key or legacy URL
  imageUrl?: string; // Presigned URL for viewing (from backend)
  categoryID?: string | null;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  user?: User | null;
  // Frontend-only fields for display
  currentBid?: string;
  timeLeft?: string;
  bidsCount?: number;
  year?: string;
}

export interface CreateAuctionDto {
  title: string;
  image: string;
  categoryID?: string;
  userId?: string;
}

export interface UpdateAuctionDto {
  title?: string;
  image?: string;
  categoryID?: string;
  userId?: string;
}
