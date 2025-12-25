export interface Auction {
  id: number;
  title: string;
  currentBid: string;
  timeLeft: string;
  image: string;
  bidsCount?: number;
  category?: string;
  year?: string;
}
