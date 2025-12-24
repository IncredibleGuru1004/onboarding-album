"use client";

import React from "react";
import CategoryCard from "@/components/gallery/CategoryCard";
import { SectionTitle } from "../layout";

// Define the type for the category data
interface Category {
  id: number;
  title: string;
  imageSrc: string;
  count: number;
}

// Mockup array for Category Cards
const categories: Category[] = [
  { id: 1, title: "Weapons", imageSrc: "/images/weapons.png", count: 10 },
  { id: 2, title: "Skulls", imageSrc: "/images/skulls.png", count: 200 },
  { id: 3, title: "Status", imageSrc: "/images/status.png", count: 30 },
  { id: 4, title: "Keep", imageSrc: "/images/keep.png", count: 400 },
  { id: 5, title: "Watches", imageSrc: "/images/watches.png", count: 50 },
  { id: 6, title: "Furniture", imageSrc: "/images/furniture.png", count: 632 },
];

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
    <div className="py-12 px-0">
      <SectionTitle
        title="Categories"
        subtitle="Party we years to order allow asked of. We so opinion friends me message as delight."
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
          {categories.map((category, index) => (
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
              />
            </GridItem>
          ))}
        </div>
      </div>
    </div>
  );
}
