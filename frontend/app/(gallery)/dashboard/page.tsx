"use client";

import { Header } from "@/components/layout";
import Sidebar from "@/components/layout/Sidebar";
import SortAndPagination from "@/components/layout/SortAndPagination";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Modal from "@/components/ui/Modal";
import { Auction } from "@/types/auction";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddAuctionModal from "@/components/ui/AddAuctionModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

/* ---------------------------------- */
/* Mock Data */
/* ---------------------------------- */

const getInitialAuctions = (categories: { id: string }[]): Auction[] => {
  return Array.from({ length: 140 }, (_, i) => ({
    id: i + 1,
    title: `Gallery Item ${i + 1}`,
    categoryID: categories[i % categories.length]?.id,
    image: "/images/auctions/rolex.png",
    currentBid: `$${(i + 1) * 100}`,
    timeLeft: "2d 5h",
    bidsCount: 32 + i,
    year: "2023",
  }));
};

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
];

const itemsPerPageOptions = [6, 12, 18, 24, 30];

/* ---------------------------------- */
/* Page */
/* ---------------------------------- */

function GalleryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasMounted = useRef(false);

  // Get categories from Redux
  const allCategories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  /* ---------- URL → STATE ---------- */

  const initialCategories = searchParams.get("categories")?.split(",") ?? [];

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSortBy = searchParams.get("sortBy") ?? "newest";

  /* ---------- STATE ---------- */

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [auctions, setAuctions] = useState<Auction[]>(() =>
    getInitialAuctions(allCategories),
  );

  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [sortBy, setSortBy] = useState<string>(initialSortBy);

  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Auction | null>(null);

  const [isAddAuctionModalOpen, setIsAddAuctionModalOpen] = useState(false);

  /* ---------- FILTER + SORT ---------- */

  const filteredAndSortedItems = useMemo(() => {
    let items = [...auctions];

    if (selectedCategories.length) {
      items = items.filter(
        (item) =>
          item.categoryID && selectedCategories.includes(item.categoryID),
      );
    }

    if (searchQuery) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    items.sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "oldest") return a.id - b.id;
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

    return items;
  }, [selectedCategories, sortBy, searchQuery, auctions]);

  /* ---------- PAGINATION ---------- */

  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(start, start + itemsPerPage);
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  /* ---------- HANDLERS ---------- */

  const handleCategoryChange = (categoryID: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryID)
        ? prev.filter((c) => c !== categoryID)
        : [...prev, categoryID],
    );
  };

  /* ---------- SYNC SELECTED CATEGORIES WITH REDUX ---------- */
  useEffect(() => {
    // Remove selected categories that no longer exist in Redux
    setSelectedCategories((prev) =>
      prev.filter((id) => allCategories.some((c) => c.id === id)),
    );
  }, [allCategories]);

  const openAddAuctionModal = () => {
    setIsAddAuctionModalOpen(true);
  };
  const handleAddAuction = (auction: Auction) => {
    setAuctions((prev) => [auction, ...prev]);
  };

  const closeAddAuctionModal = () => {
    setIsAddAuctionModalOpen(false);
  };

  const handleUpdateAuction = (updatedAuction: Auction) => {
    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === updatedAuction.id ? updatedAuction : auction,
      ),
    );
    // Update selectedItem if it's the one being edited
    if (selectedItem && selectedItem.id === updatedAuction.id) {
      setSelectedItem(updatedAuction);
    }
  };

  /* ---------- RESET PAGE ---------- */

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    setCurrentPage(1);
  }, [selectedCategories, sortBy]);

  /* ---------- SYNC STATE → URL ---------- */

  useEffect(() => {
    if (!hasMounted.current) return;

    const params = new URLSearchParams();

    if (selectedCategories.length) {
      params.set("categories", selectedCategories.join(","));
    }

    params.set("page", currentPage.toString());
    params.set("sortBy", sortBy);

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  }, [selectedCategories, currentPage, sortBy, router]);

  /* ---------- MODAL ---------- */

  const openModal = (item: Auction) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  /* ---------- RENDER ---------- */

  return (
    <>
      <Header showNavLinks={false} />

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />

        <main className="ml-64 flex-1 p-8">
          <SortAndPagination
            sortBy={sortBy}
            setSortBy={setSortBy}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            sortOptions={sortOptions}
            itemsPerPageOptions={itemsPerPageOptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          >
            <GalleryGrid auctions={paginatedItems} openModal={openModal} />

            {paginatedItems.length === 0 && (
              <p className="mt-12 text-center text-gray-500">No items found.</p>
            )}
          </SortAndPagination>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        auction={selectedItem}
        categories={allCategories}
        onUpdate={handleUpdateAuction}
      />
      <AddAuctionModal
        isOpen={isAddAuctionModalOpen}
        onClose={closeAddAuctionModal}
        onAddAuction={handleAddAuction}
      />

      <button
        onClick={openAddAuctionModal}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition"
        aria-label="Add new auction"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 5v14M5 12h14"
          />
        </svg>
      </button>
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <GalleryPageContent />
    </Suspense>
  );
}
