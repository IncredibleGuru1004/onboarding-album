"use client";

import React from "react";
import CategoryCard from "@/components/gallery/CategoryCard";

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
  return (
    <div className="bg-gray-100 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div
          className={[
            // base (small): stack
            "grid gap-6 auto-rows-fr grid-cols-1",

            "md:grid-cols-2 md:auto-rows-fr",

            // lg: your original 5x5 layout
            "lg:grid-cols-4 lg:grid-rows-2",
          ].join(" ")}
        >
          {/* 1 */}
          <GridItem
            className={[
              // md position
              "md:col-start-1 md:row-start-1",
              // lg: default flow for item 1
              "lg:col-auto lg:row-auto",
            ].join(" ")}
          >
            <CategoryCard
              title="Weapons"
              imageSrc="/images/weapons.png"
              count={1}
            />
          </GridItem>

          {/* 2 */}
          <GridItem
            className={[
              // md position
              "md:col-start-1 md:row-start-2",
              // lg position (your original)
              "lg:col-start-1 lg:row-start-2",
            ].join(" ")}
          >
            <CategoryCard
              title="Skulls"
              imageSrc="/images/skulls.png"
              count={2}
            />
          </GridItem>

          {/* 3 (spans 2 rows in md and lg) */}
          <GridItem
            className={[
              // md position + span
              "md:col-start-2 md:row-start-1 md:row-span-2",
              // lg position + span (your original)
              "lg:col-start-2 lg:row-start-1 lg:row-span-2",
            ].join(" ")}
          >
            <CategoryCard
              title="Status"
              imageSrc="/images/status.png"
              count={3}
            />
          </GridItem>

          {/* 4 (full width in md: spans both columns; in lg spans 2 columns starting at col 3) */}
          <GridItem
            className={[
              // md: row 3, full width
              "md:col-span-2 md:col-start-1 md:row-start-3",
              // lg: your original
              "lg:col-span-2 lg:col-start-3 lg:row-start-1",
            ].join(" ")}
          >
            <CategoryCard title="Keep" imageSrc="/images/keep.png" count={4} />
          </GridItem>

          {/* 5 */}
          <GridItem
            className={[
              // md: bottom-left
              "md:col-start-1 md:row-start-4",
              // lg: your original
              "lg:col-start-3 lg:row-start-2",
            ].join(" ")}
          >
            <CategoryCard
              title="Watches"
              imageSrc="/images/watches.png"
              count={5}
            />
          </GridItem>

          {/* 6 */}
          <GridItem
            className={[
              // md: bottom-right
              "md:col-start-2 md:row-start-4",
              // lg: your original
              "lg:col-start-4 lg:row-start-2",
            ].join(" ")}
          >
            <CategoryCard
              title="Furniture"
              imageSrc="/images/furniture.png"
              count={6}
            />
          </GridItem>
        </div>
      </div>
    </div>
  );
}
