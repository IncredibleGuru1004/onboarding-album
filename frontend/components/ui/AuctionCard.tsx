import Image from "next/image";

interface AuctionCardProps {
  title: string;
  currentBid: string;
  timeLeft: string;
  image: string;
  bidsCount?: number; // Optional: if you want to show "32 bids"
  category?: string; // Optional: e.g., "Tools", "Art", etc.
  year?: string; // Optional: e.g., "Year 1012"
}

export default function AuctionCard({
  title,
  timeLeft,
  image,
  bidsCount = 32, // Default value for mock
  category = "Tools",
  year = "Year 1012",
}: AuctionCardProps) {
  return (
    <div className="w-[386px] flex-shrink-0 bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] duration-300">
      {/* Image section */}
      <div className="p-4">
        <div className="relative w-full h-[190px] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 386px"
            priority={false}
          />
        </div>
      </div>

      {/* Text content */}
      <div className="p-8 pt-[8px]">
        <h1 className="text-[20px] font-poppins font-semibold text-gray-900 line-clamp-2">
          {title}
        </h1>
        <p className="font-inter font-medium text-[12px] text-[#8a8a8a] mt-1">
          {year} <span className="mx-1 text-gray-400">|</span> {category}
        </p>

        {/* Bottom bidding info */}
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
