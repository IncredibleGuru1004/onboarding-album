"use client";

import { useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";

/**
 * CategoryInitializer Component
 *
 * Automatically fetches categories when the app loads.
 * This is NON-BLOCKING - it doesn't wait for categories to load.
 * Use this in the root layout to start fetching categories early.
 * For pages that need categories to be loaded before rendering,
 * use CategoryLoader instead.
 */
export default function CategoryInitializer() {
  const { loadCategories, categories, isLoading } = useCategories();

  useEffect(() => {
    // Fetch categories on mount if not already loaded or loading
    if (categories.length === 0 && !isLoading) {
      loadCategories();
    }
  }, []); // Only run once on mount

  // This component doesn't render anything
  return null;
}
