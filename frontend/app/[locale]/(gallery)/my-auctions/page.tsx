"use client";

import { Header } from "@/components/layout";
import GalleryCard from "@/components/gallery/GalleryCard";
import Modal from "@/components/ui/Modal";
import { openConfirmDialog } from "@/store/uiSlice";
import { Auction } from "@/types/auction";
import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useAuctions } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { openAuctionModal } from "@/store/auctionSlice";
import {
  TrashIcon,
  ArrowLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function MyAuctionsPage() {
  const t = useTranslations("myAuctions");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { myAuctions, isLoadingMyAuctions, loadMyAuctions } = useAuctions();
  const allCategories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Auction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Load my auctions on mount
  useEffect(() => {
    if (user?.id && myAuctions.length === 0 && !isLoadingMyAuctions) {
      loadMyAuctions();
    }
  }, [user?.id, myAuctions.length, isLoadingMyAuctions, loadMyAuctions]);

  // Filter and sort
  const filteredAndSortedItems = useMemo(() => {
    let items = [...myAuctions];

    // Search filter
    if (searchQuery) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

    return items;
  }, [myAuctions, searchQuery, sortBy]);

  const openModal = (item: Auction) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleUpdateAuction = (updatedAuction: Auction) => {
    if (selectedItem && selectedItem.id === updatedAuction.id) {
      setSelectedItem(updatedAuction);
    }
  };

  const handleDeleteAuction = (auctionId: number) => {
    dispatch(
      openConfirmDialog({
        title: t("confirmDeleteTitle") || "Delete Auction",
        message:
          t("confirmDeleteMessage") ||
          "Are you sure you want to delete this auction? This action cannot be undone.",
        confirmText: t("confirmDeleteButton") || "Delete",
        cancelText: t("cancel") || "Cancel",
        type: "auction",
        id: auctionId,
      }),
    );
  };

  const openAddModal = () => {
    dispatch(openAuctionModal({ mode: "add" }));
  };

  const sortOptions = [
    { value: "newest", label: t("newestFirst") },
    { value: "oldest", label: t("oldestFirst") },
    { value: "title-asc", label: t("titleAZ") },
    { value: "title-desc", label: t("titleZA") },
  ];

  return (
    <>
      <Header showNavLinks={false} />

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToDashboard")}</span>
          </button>

          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("title")}
              </h1>
              <p className="text-gray-600">
                {t("subtitle")}
                {myAuctions.length > 0 && (
                  <span className="ml-2 text-gray-500">
                    ({t("totalItems", { count: myAuctions.length })})
                  </span>
                )}
              </p>
            </div>
            {/* Add New Auction Button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{t("addNewAuction") || "Add New Auction"}</span>
            </button>
          </div>

          {/* Controls Section */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="w-full sm:w-96">
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t("sortBy")}:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingMyAuctions && filteredAndSortedItems.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">{t("loading")}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingMyAuctions && filteredAndSortedItems.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("noAuctions")}
              </h3>
              <p className="text-gray-600 mb-6">{t("noAuctionsDesc")}</p>
            </div>
          )}

          {/* Grid with Delete Buttons */}
          {filteredAndSortedItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedItems.map((auction) => {
                const category = auction.categoryID
                  ? allCategories.find((c) => c.id === auction.categoryID)
                  : undefined;

                return (
                  <div key={auction.id} className="relative group">
                    <GalleryCard
                      auction={auction}
                      onClick={() => openModal(auction)}
                      categoryName={category?.title}
                    />
                    {/* Delete Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAuction(auction.id);
                      }}
                      className="absolute top-4 right-4 z-10 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                      title={t("delete")}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        auction={selectedItem}
        categories={allCategories}
        onUpdate={handleUpdateAuction}
      />
    </>
  );
}
