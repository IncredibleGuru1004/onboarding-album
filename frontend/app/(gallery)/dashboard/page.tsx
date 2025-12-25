"use client";

import { Header } from "@/components/layout";
import Sidebar from "@/components/layout/Sidebar";
import SortAndPagination from "@/components/layout/SortAndPagination";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal"; // Assuming Modal is available in your UI components
import { Auction } from "@/types/auction";

const categories = [
  "Nature",
  "Architecture",
  "Portrait",
  "Abstract",
  "Landscape",
  "Street",
];

const mockData: Auction[] = Array.from({ length: 140 }, (_, i) => ({
  id: i + 1,
  title: `Gallery Item ${i + 1}`,
  category: categories[i % categories.length],
  image: "/images/auctions/rolex.png", // ✅ fixed
  currentBid: `$${(i + 1) * 100}`, // ✅ required
  timeLeft: "2d 5h", // ✅ required
  bidsCount: 32 + i,
  year: "2023",
}));

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
];

const itemsPerPageOptions = [6, 12, 18, 24, 30];

export default function GalleryPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [allCategories, setAllCategories] = useState<string[]>(categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Auction | null>(null);

  // Filtering and sorting logic
  const filteredAndSortedItems = useMemo(() => {
    let items = [...mockData];

    if (selectedCategories.length > 0) {
      items = items.filter(
        (item) => item.category && selectedCategories.includes(item.category),
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
  }, [selectedCategories, sortBy, searchQuery]);

  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(start, start + itemsPerPage);
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  // Handling category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handling category update
  const handleCategoryUpdate = (oldCategory: string, newCategory: string) => {
    setAllCategories((prev) =>
      prev.map((category) =>
        category === oldCategory ? newCategory : category,
      ),
    );
  };

  // Handling category deletion
  const handleCategoryDelete = (category: string) => {
    setAllCategories((prev) => prev.filter((c) => c !== category));
    // Remove the category from selected categories if it's selected
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  // Open modal with the clicked item
  const openModal = (item: Auction) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      {/* Header */}
      <Header showNavLinks={false} />

      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <Sidebar
          allCategories={allCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          onCategoryUpdate={handleCategoryUpdate}
          onCategoryDelete={handleCategoryDelete}
          setAllCategories={setAllCategories}
        />

        {/* Main Content */}
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

            {/* No items found */}
            {paginatedItems.length === 0 && (
              <p className="text-center text-gray-500 mt-12">No items found.</p>
            )}
          </SortAndPagination>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedItem?.title ?? ""}
        image={selectedItem?.image ?? ""}
        currentBid={selectedItem?.currentBid ?? ""}
        timeLeft={selectedItem?.timeLeft ?? ""}
        bidsCount={selectedItem?.bidsCount ?? 0}
        category={selectedItem?.category ?? ""}
        year={selectedItem?.year ?? ""}
      />
    </>
  );
}
