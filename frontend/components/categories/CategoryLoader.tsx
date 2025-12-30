"use client";

import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";

/**
 * CategoryLoader Component
 *
 * Blocks rendering until categories are loaded.
 * Use this in layouts where categories MUST be available before rendering.
 * For example, in the dashboard where category filters are critical.
 */
export default function CategoryLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadCategories, categories, isLoading } = useCategories();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Fetch categories on mount
    const initializeCategories = async () => {
      if (categories.length === 0 && !isLoading) {
        await loadCategories();
      }
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeCategories();
    }
  }, [categories.length, isLoading, isInitialized, loadCategories]);

  // Show loading state while categories are being fetched for the first time
  if (!isInitialized || (isLoading && categories.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Render children once categories are loaded or loading is complete
  return <>{children}</>;
}
