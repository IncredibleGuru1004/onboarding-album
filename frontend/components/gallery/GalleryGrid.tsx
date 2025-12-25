import React from "react";
import GalleryCard from "@/components/gallery/GalleryCard";
import { Auction } from "@/types/auction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface GalleryGridProps {
  auctions: Auction[];
  openModal: (auction: Auction) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ auctions, openModal }) => {
  const allCategories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => {
        const category = auction.categoryID
          ? allCategories.find((c) => c.id === auction.categoryID)
          : undefined;

        return (
          <div key={auction.id}>
            <GalleryCard
              auction={auction}
              onClick={() => openModal(auction)}
              categoryName={category?.title}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GalleryGrid;
