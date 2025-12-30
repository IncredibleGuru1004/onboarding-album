"use client";

import { AuthInitializer } from "@/components/auth/AuthInitializer";
import CategoryLoader from "@/components/categories/CategoryLoader";
import AuctionLoader from "@/components/auctions/AuctionLoader";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      <CategoryLoader>
        <AuctionLoader>{children}</AuctionLoader>
      </CategoryLoader>
    </>
  );
}
