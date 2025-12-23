"use client";

import React, { useRef, useEffect } from "react";
import GalleryCard from "@/components/gallery/GalleryCard";

// Mock auction data (same as before)
const mockAuctions = [
  {
    id: 1,
    title: "Modern Abstract Painting #42",
    currentBid: "$3,200",
    timeLeft: "2d 14h",
    image: "/images/auctions/abstract1.png",
  },
  {
    id: 2,
    title: "Vintage Rolex Submariner 1968",
    currentBid: "$12,500",
    timeLeft: "5h 32m",
    image: "/images/auctions/rolex.png",
  },
  {
    id: 3,
    title: 'Bronze Sculpture "Eternal Flow"',
    currentBid: "$18,900",
    timeLeft: "1d 8h",
    image: "/images/auctions/sculpture.png",
  },
  {
    id: 1,
    title: "Modern Abstract Painting #42",
    currentBid: "$3,200",
    timeLeft: "2d 14h",
    image: "/images/auctions/abstract1.png",
  },
  {
    id: 2,
    title: "Vintage Rolex Submariner 1968",
    currentBid: "$12,500",
    timeLeft: "5h 32m",
    image: "/images/auctions/rolex.png",
  },
  {
    id: 3,
    title: 'Bronze Sculpture "Eternal Flow"',
    currentBid: "$18,900",
    timeLeft: "1d 8h",
    image: "/images/auctions/sculpture.png",
  },
  {
    id: 1,
    title: "Modern Abstract Painting #42",
    currentBid: "$3,200",
    timeLeft: "2d 14h",
    image: "/images/auctions/abstract1.png",
  },
  {
    id: 2,
    title: "Vintage Rolex Submariner 1968",
    currentBid: "$12,500",
    timeLeft: "5h 32m",
    image: "/images/auctions/rolex.png",
  },
  {
    id: 3,
    title: 'Bronze Sculpture "Eternal Flow"',
    currentBid: "$18,900",
    timeLeft: "1d 8h",
    image: "/images/auctions/sculpture.png",
  },
];

export default function GallerySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div>
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Hidden scrollbar + draggable container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar cursor-grab select-none"
        >
          <div className="flex gap-6">
            {mockAuctions.map((auction) => (
              <div key={auction.id} className="flex-shrink-0">
                <GalleryCard
                  title={auction.title}
                  currentBid={auction.currentBid}
                  timeLeft={auction.timeLeft}
                  image={auction.image}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

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
