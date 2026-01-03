"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import GalleryCard from "@/components/gallery/GalleryCard";
import Modal from "../ui/Modal";
import { NavigationButtons } from "../ui/NavigationButtons";
import { SectionTitle } from "../layout";
import { Auction } from "@/types/auction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuctions } from "@/hooks/useAuctions";

export default function GallerySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const { recentAuctions, isLoading, loadRecentAuctions } = useAuctions();

  // Fetch recent auctions on component mount
  useEffect(() => {
    if (recentAuctions.length === 0 && !isLoading) {
      loadRecentAuctions();
    }
  }, [recentAuctions.length, isLoading, loadRecentAuctions]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Function to scroll the container left or right
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300; // Scroll amount (adjust as needed)
    const newScrollPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    // Use scrollTo with smooth behavior
    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  const openModal = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAuction(null);
  };

  const t = useTranslations("home");

  return (
    <div>
      <SectionTitle
        title={t("recentlyAdded")}
        subtitle={t("recentlyAddedSubtitle")}
        rightContent={<NavigationButtons onScroll={handleScroll} />}
      />
      <section className="">
        {/* Hidden scrollbar + draggable container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto py-4  hide-scrollbar cursor-grab select-none"
        >
          <div className="flex gap-6">
            {isLoading && recentAuctions.length === 0 ? (
              // Loading state
              <div className="flex items-center justify-center w-full py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentAuctions.length === 0 ? (
              // Empty state
              <div className="flex items-center justify-center w-full py-8">
                <p className="text-gray-500">
                  {t("noRecentAuctions") || "No recent auctions available"}
                </p>
              </div>
            ) : (
              // Render auctions
              recentAuctions.map((auction) => {
                const category = auction.categoryID
                  ? categories.find((c) => c.id === auction.categoryID)
                  : undefined;

                return (
                  <div key={auction.id} className="flex-shrink-0">
                    <GalleryCard
                      auction={auction}
                      onClick={() => {
                        openModal(auction);
                      }}
                      categoryName={category?.title}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        auction={selectedAuction}
        categories={categories}
      />

      {/* Tailwind utility to hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
}
