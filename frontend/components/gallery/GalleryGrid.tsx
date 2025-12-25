import React from "react";
import GalleryCard from "@/components/gallery/GalleryCard";
import { Auction } from "@/types/auction"; // Import the GalleryItem type

interface GalleryGridProps {
  auctions: Auction[]; // Use the defined type here
  openModal: (auction: Auction) => void; // New prop to handle opening the modal
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ auctions, openModal }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <div key={auction.id}>
          <GalleryCard
            auction={auction}
            onClick={() => openModal(auction)} // Pass the auction to the modal when clicked
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
