export interface Auction {
  id: number;
  title: string;
  currentBid: string;
  timeLeft: string;
  image: string;
  bidsCount?: number;
  categoryID?: string;
  year?: string;
}
