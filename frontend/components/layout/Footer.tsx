"use client";

import React from "react";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white  border-t border-zinc-200  mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {currentYear} {t("imageGallery")}. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};
