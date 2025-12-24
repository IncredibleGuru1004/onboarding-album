"use client";

import { Header } from "@/components/layout";
import Sidebar from "@/components/layout/Sidebar";
import SortAndPagination from "@/components/layout/SortAndPagination";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { useMemo, useState } from "react";

const categories = [
  "Nature",
  "Architecture",
  "Portrait",
  "Abstract",
  "Landscape",
  "Street",
];

const mockData = Array.from({ length: 140 }, (_, i) => ({
  id: i + 1,
  title: `Gallery Item ${i + 1}`,
  category: categories[i % categories.length],
  imageUrl: "/images/auctions/rolex.png",
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
  const [newCategory, setNewCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<string[]>(categories);

  const filteredAndSortedItems = useMemo(() => {
    let items = [...mockData];

    if (selectedCategories.length > 0) {
      items = items.filter((item) =>
        selectedCategories.includes(item.category),
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
  }, [selectedCategories, sortBy]);

  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(start, start + itemsPerPage);
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleAddCategory = () => {
    if (newCategory && !allCategories.includes(newCategory)) {
      setAllCategories((prev) => [...prev, newCategory]);
      setNewCategory(""); // Clear the input field
    } else {
      alert("Please enter a valid, unique category name!");
    }
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
          newCategory={newCategory}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
          setNewCategory={setNewCategory}
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
          >
            {/* Gallery Grid */}
            <GalleryGrid paginatedItems={paginatedItems} />
          </SortAndPagination>

          {/* No items found */}
          {paginatedItems.length === 0 && (
            <p className="text-center text-gray-500 mt-12">No items found.</p>
          )}
        </main>
      </div>
    </>
  );
}
