"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { Auction } from "@/types/auction";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { openAuctionModal } from "@/store/auctionSlice";
import { getImageUrl } from "@/lib/imageUtils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: Auction | null;
  categories: { id: string; title: string }[];
  onUpdate?: (auction: Auction) => void;
}

const Modal = ({
  isOpen,
  onClose,
  auction,
  categories,
  onUpdate,
}: ModalProps) => {
  const t = useTranslations("modal");
  const dispatch = useDispatch<AppDispatch>();
  const [displayImageUrl, setDisplayImageUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && auction) {
      // Get display URL for the image
      getImageUrl(auction.image, auction.imageUrl).then(setDisplayImageUrl);
    }
  }, [isOpen, auction]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
        if (
          [
            "ArrowUp",
            "ArrowDown",
            "Space",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ].includes(e.key)
        ) {
          e.preventDefault();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleEdit = () => {
    if (auction) {
      dispatch(openAuctionModal({ mode: "edit", auction }));
      onClose(); // Close the view modal when opening edit modal
    }
  };

  if (!isOpen || !auction) return null;

  const categoryTitle = auction.categoryID
    ? (categories.find((c) => c.id === auction.categoryID)?.title ?? "")
    : "";

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      {/* Dark overlay - clickable to close */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Action buttons - top-right */}
      <div className="absolute top-6 right-6 z-[101] flex items-center gap-2">
        {onUpdate && (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
            aria-label={t("editAuctionLabel")}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
          aria-label={t("closeModal")}
        >
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Modal Content Card */}
      <div className="relative z-[101] bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              {auction.title}
            </h2>

            <div className="mt-6">
              <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-100">
                {displayImageUrl || auction.imageUrl || auction.image ? (
                  <Image
                    src={displayImageUrl || auction.imageUrl || auction.image}
                    alt={auction.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    unoptimized={(
                      displayImageUrl ||
                      auction.imageUrl ||
                      auction.image ||
                      ""
                    ).includes("?")} // Disable optimization for presigned URLs
                    onError={() => {
                      // Clear display URL on error to show placeholder
                      setDisplayImageUrl("");
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-800">
                    <span className="font-medium text-gray-600">
                      {t("currentBid")}:
                    </span>{" "}
                    {auction.currentBid}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t("closesIn")}</p>
                    <p className="text-gray-900 font-medium">
                      {auction.timeLeft}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("bids")}</p>
                    <p className="text-gray-900 font-medium">
                      {auction.bidsCount || 0}
                    </p>
                  </div>
                </div>
                {categoryTitle && (
                  <div>
                    <p className="text-sm text-gray-500">{t("category")}</p>
                    <p className="text-gray-900 font-medium">{categoryTitle}</p>
                  </div>
                )}
                {auction.year && (
                  <div>
                    <p className="text-sm text-gray-500">{t("year")}</p>
                    <p className="text-gray-900 font-medium">{auction.year}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
