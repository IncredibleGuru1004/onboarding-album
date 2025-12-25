import Image from "next/image";
import { Auction } from "@/types/auction";

interface GalleryCardProps {
  auction: Auction;
  onClick: () => void;
}

export default function GalleryCard({ auction, onClick }: GalleryCardProps) {
  const {
    title,
    timeLeft,
    image,
    bidsCount = 32,
    category = "Tools",
    year = "Year 1012",
  } = auction;

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] duration-300 cursor-pointer"
    >
      <div className="p-4">
        <div className="relative w-full h-[190px] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 386px"
          />
        </div>
      </div>

      <div className="p-8 pt-[8px]">
        <h1 className="text-[20px] font-poppins font-semibold text-gray-900 line-clamp-2">
          {title}
        </h1>
        <p className="font-inter font-medium text-[12px] text-[#8a8a8a] mt-1">
          {year} <span className="mx-1 text-gray-400">|</span> {category}
        </p>

        <div className="flex justify-between items-center mt-[40px]">
          <p className="text-[12px] font-semibold font-poppins text-gray-700">
            {bidsCount} bids so far
          </p>
          <p className="text-[12px] font-normal font-poppins text-[#2d3134]/60">
            Closes in {timeLeft}
          </p>
        </div>
      </div>
    </div>
  );
}
