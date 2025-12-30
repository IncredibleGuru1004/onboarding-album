"use client";

import { useEffect, useState } from "react";
import { useAuctions } from "@/hooks/useAuctions";

/**
 * AuctionLoader Component
 *
 * Blocks rendering until auctions are loaded.
 * Use this in layouts where auctions MUST be available before rendering.
 */
export default function AuctionLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadAuctions, auctions, isLoading } = useAuctions();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Fetch auctions on mount
    const initializeAuctions = async () => {
      if (auctions.length === 0 && !isLoading) {
        await loadAuctions();
      }
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeAuctions();
    }
  }, [auctions.length, isLoading, isInitialized, loadAuctions]);

  // Show loading state while auctions are being fetched for the first time
  if (!isInitialized || (isLoading && auctions.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading auctions...</p>
        </div>
      </div>
    );
  }

  // Render children once auctions are loaded or loading is complete
  return <>{children}</>;
}
