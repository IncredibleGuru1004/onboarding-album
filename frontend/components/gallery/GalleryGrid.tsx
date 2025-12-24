import React from "react";
import GalleryCard from "@/components/gallery/GalleryCard";

// Define the type for the gallery items
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface GalleryGridProps {
  paginatedItems: GalleryItem[]; // Use the defined type here
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ paginatedItems }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedItems.map((item) => (
        <div key={item.id}>
          <GalleryCard
            title={item.title}
            currentBid={item.category}
            image={item.imageUrl} // Use the actual image URL from the item
            onClick={() => {}}
            timeLeft="12"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
