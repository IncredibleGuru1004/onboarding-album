"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export const Hero = () => {
  const t = useTranslations("home");

  return (
    <section className="relative bg-white flex items-center justify-center overflow-hidden">
      {/* Content Container */}
      <div className="relative container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-0 max-w-7xl">
        {/* Left: Text Content */}
        <div className="md:w-1/2 text-left space-y-8 font-poppins text-[52px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-[#2d3134]">{t("worldsBiggest")}</span>
            <br />
            <span className="text-[#263fa4]">{t("antiqueCollection")}</span>
          </h1>
          <p className="text-[#676a6c] text-sm md:text-base max-w-lg leading-relaxed font-inder">
            {t("heroDescription")}
          </p>
        </div>

        {/* Right: Vase Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-80 h-96 md:w-96 md:h-[500px] lg:w-[500px] lg:h-[600px]">
            <Image
              src="/images/image_hero.png"
              alt={t("antiqueCollection")}
              fill
              sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 500px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
