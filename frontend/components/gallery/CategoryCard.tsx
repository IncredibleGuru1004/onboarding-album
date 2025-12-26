"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

type CategoryCardProps = {
  title: string;
  count: number;
  imageSrc: string;
  large?: boolean;
  onClick?: () => void;
};

export default function CategoryCard({
  title,
  count,
  imageSrc,
  onClick,
}: CategoryCardProps) {
  const t = useTranslations("categoryCard");
  return (
    <div
      onClick={onClick}
      className={`relative h-full w-full overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-300 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Count Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-white text-[#ff7b29] text-[14px] font-semibold px-4 py-2 rounded-full shadow-lg">
          {count}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="33vw, 25vw"
        />
      </div>

      {/* Title Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#242428]/60 to-transparent p-8 pt-20">
        <h3 className={`font-bold text-white text-[24px] font-inter`}>
          {title}
        </h3>
        <p className={`text-white/90 text-[12px] font-medium font-inter`}>
          {t("worefall")}
        </p>
      </div>
    </div>
  );
}
