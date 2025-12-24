"use client";

import React, { useRef, useEffect, useState } from "react";
import GalleryCard from "@/components/gallery/GalleryCard";
import Modal from "../ui/Modal";
import { NavigationButtons } from "../ui/NavigationButtons";
import { SectionTitle } from "../layout";

// Define the Auction type
interface Auction {
  id: number;
  title: string;
  currentBid: string;
  timeLeft: string;
  image: string;
  bidsCount?: number;
  category?: string;
  year?: string;
}

// Mock auction data (same as before)
const mockAuctions: Auction[] = [
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
    id: 4,
    title: "Modern Abstract Painting #42",
    currentBid: "$3,200",
    timeLeft: "2d 14h",
    image: "/images/auctions/abstract1.png",
  },
  {
    id: 5,
    title: "Vintage Rolex Submariner 1968",
    currentBid: "$12,500",
    timeLeft: "5h 32m",
    image: "/images/auctions/rolex.png",
  },
  {
    id: 6,
    title: 'Bronze Sculpture "Eternal Flow"',
    currentBid: "$18,900",
    timeLeft: "1d 8h",
    image: "/images/auctions/sculpture.png",
  },
  {
    id: 7,
    title: "Modern Abstract Painting #42",
    currentBid: "$3,200",
    timeLeft: "2d 14h",
    image: "/images/auctions/abstract1.png",
  },
  {
    id: 8,
    title: "Vintage Rolex Submariner 1968",
    currentBid: "$12,500",
    timeLeft: "5h 32m",
    image: "/images/auctions/rolex.png",
  },
  {
    id: 9,
    title: 'Bronze Sculpture "Eternal Flow"',
    currentBid: "$18,900",
    timeLeft: "1d 8h",
    image: "/images/auctions/sculpture.png",
  },
];

export default function GallerySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

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

  return (
    <div>
      <SectionTitle
        title="Recently Added"
        subtitle="Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment."
        rightContent={<NavigationButtons onScroll={handleScroll} />}
      />
      <section className="">
        {/* Hidden scrollbar + draggable container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto py-4  hide-scrollbar cursor-grab select-none"
        >
          <div className="flex gap-6">
            {mockAuctions.map((auction) => (
              <div key={auction.id} className="flex-shrink-0">
                <GalleryCard
                  title={auction.title}
                  currentBid={auction.currentBid}
                  timeLeft={auction.timeLeft}
                  image={auction.image}
                  onClick={() => openModal(auction)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedAuction?.title || ""}
        image={selectedAuction?.image || ""}
        currentBid={selectedAuction?.currentBid || ""}
        timeLeft={selectedAuction?.timeLeft || ""}
        bidsCount={selectedAuction?.bidsCount || 0}
        category={selectedAuction?.category || ""}
        year={selectedAuction?.year || ""}
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
