"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Auction } from "@/types/auction";
import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/imageUtils";

interface GalleryCardProps {
  auction: Auction;
  onClick: () => void;
  categoryName?: string;
}

export default function GalleryCard({
  auction,
  onClick,
  categoryName,
}: GalleryCardProps) {
  const t = useTranslations("galleryCard");
  const {
    title,
    timeLeft,
    image,
    imageUrl,
    bidsCount = 32,
    year = "Year 1012",
  } = auction;

  const [displayUrl, setDisplayUrl] = useState<string>(imageUrl || image || "");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If imageUrl is not provided, fetch it
    if (!imageUrl && image) {
      getImageUrl(image, imageUrl)
        .then((url) => {
          if (url) {
            setDisplayUrl(url);
            setHasError(false);
          }
        })
        .catch(() => {
          setHasError(true);
        });
    } else if (imageUrl) {
      setDisplayUrl(imageUrl);
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, [image, imageUrl]);

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] duration-300 cursor-pointer"
    >
      <div className="p-4">
        <div className="relative w-full h-[190px] rounded-2xl overflow-hidden bg-gray-100">
          {displayUrl && !hasError ? (
            <Image
              src={displayUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 386px"
              unoptimized={displayUrl.includes("?")} // Disable optimization for presigned URLs
              onError={() => {
                setHasError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <PhotoIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-8 pt-[8px]">
        <h1 className="text-[20px] font-poppins font-semibold text-gray-900 line-clamp-2">
          {title}
        </h1>
        <p className="font-inter font-medium text-[12px] text-[#8a8a8a] mt-1">
          {year}{" "}
          {categoryName && (
            <>
              <span className="mx-1 text-gray-400">|</span> {categoryName}
            </>
          )}
        </p>

        <div className="flex justify-between items-center mt-[40px]">
          <p className="text-[12px] font-semibold font-poppins text-gray-700">
            {bidsCount} {t("bidsSoFar")}
          </p>
          <p className="text-[12px] font-normal font-poppins text-[#2d3134]/60">
            {t("closesIn")} {timeLeft}
          </p>
        </div>
      </div>
    </div>
  );
}
