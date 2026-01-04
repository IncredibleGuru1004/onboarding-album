"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import CategoryCard from "@/components/gallery/CategoryCard";
import { SectionTitle } from "../layout";
import { Button } from "../ui/Button";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/lib/imageUtils";

type GridItemProps = {
  children: React.ReactNode;
  className?: string;
};

function GridItem({ children, className = "" }: GridItemProps) {
  return (
    <div
      className={[
        "rounded-xl shadow-lg overflow-hidden",
        "min-h-64",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function CategorySection() {
  const t = useTranslations("home");
  const router = useRouter();
  const {
    categories: allCategories,
    isLoading,
    loadCategories,
  } = useCategories();
  const [categoryImageUrls, setCategoryImageUrls] = useState<
    Record<string, string>
  >({});

  // Load categories on mount
  useEffect(() => {
    if (allCategories.length === 0 && !isLoading) {
      loadCategories();
    }
  }, [allCategories.length, isLoading, loadCategories]);

  // Fetch image URLs for categories
  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        allCategories.map(async (category) => {
          if (category.image) {
            try {
              const url = await getImageUrl(
                category.image,
                category.imageUrl || undefined,
              );
              urls[category.id] = url;
            } catch (error) {
              console.error(
                `Failed to get image URL for category ${category.id}:`,
                error,
              );
            }
          }
        }),
      );
      setCategoryImageUrls(urls);
    };

    if (allCategories.length > 0) {
      fetchImageUrls();
    }
  }, [allCategories]);

  // Get top 6 categories sorted by auctionCount (descending)
  const topCategories = useMemo(() => {
    return allCategories
      .filter((cat) => (cat.auctionCount ?? 0) > 0) // Only categories with auctions
      .sort((a, b) => (b.auctionCount ?? 0) - (a.auctionCount ?? 0)) // Sort by count descending
      .slice(0, 6) // Take top 6
      .map((category) => ({
        id: category.id,
        title: category.title,
        imageSrc:
          categoryImageUrls[category.id] ||
          category.imageUrl ||
          category.image ||
          "/images/placeholder.png",
        count: category.auctionCount ?? 0,
      }));
  }, [allCategories, categoryImageUrls]);

  const handleViewDetails = () => {
    router.push("/dashboard");
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to dashboard with the category ID as a search parameter
    router.push(`/dashboard?categories=${categoryId}`);
  };

  return (
    <div className="py-12 px-0">
      <SectionTitle
        title={t("categories")}
        subtitle={t("categoriesSubtitle")}
        rightContent={
          <Button
            variant="outlined"
            className="border-[#30BBD7] text-[#30BBD7]"
            onClick={handleViewDetails}
          >
            {t("viewDetails")}
          </Button>
        }
      />
      <div className="mx-auto py-4 ">
        <div
          className={[
            // base (small): stack
            "grid gap-6 auto-rows-fr grid-cols-1",
            "md:grid-cols-2 md:auto-rows-fr",
            // lg layout for 4 columns
            "lg:grid-cols-4 lg:grid-rows-2",
          ].join(" ")}
        >
          {topCategories.length > 0 ? (
            topCategories.map((category, index) => (
              <GridItem
                key={category.id}
                className={[
                  // md positions, ensure each item is placed correctly
                  index === 0 && "md:col-start-1 md:row-start-1",
                  index === 1 && "md:col-start-1 md:row-start-2",
                  index === 2 && "md:col-start-2 md:row-start-1 md:row-span-2",
                  index === 3 && "md:col-span-2 md:col-start-1 md:row-start-3",
                  index === 4 && "md:col-start-1 md:row-start-4", // Ensure this is visible
                  index === 5 && "md:col-start-2 md:row-start-4",

                  // lg positions, define the grid for larger screens
                  index === 0 && "lg:col-start-1 lg:row-start-1",
                  index === 1 && "lg:col-start-1 lg:row-start-2",
                  index === 2 && "lg:col-start-2 lg:row-start-1 lg:row-span-2",
                  index === 3 && "lg:col-start-3 lg:row-start-1 lg:col-span-2",
                  index === 4 && "lg:col-start-3 lg:row-start-2", // Make sure it's not off-screen
                  index === 5 && "lg:col-start-4 lg:row-start-2",
                ].join(" ")}
              >
                <CategoryCard
                  title={category.title}
                  imageSrc={category.imageSrc}
                  count={category.count}
                  onClick={() => handleCategoryClick(category.id)}
                />
              </GridItem>
            ))
          ) : isLoading ? (
            // Loading state
            <div className="col-span-full text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : (
            // Empty state
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
