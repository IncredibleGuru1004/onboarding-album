"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Auction } from "@/types/auction";
import { Input } from "./Input";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAuction, setEditedAuction] = useState<Auction | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && auction) {
      setEditedAuction({ ...auction });
      setIsEditMode(false);
      setError("");
    }
  }, [isOpen, auction]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isEditMode) {
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
  }, [isOpen, isEditMode, onClose]);

  const handleEdit = () => {
    setIsEditMode(true);
    setError("");
  };

  const handleCancel = () => {
    if (auction) {
      setEditedAuction({ ...auction });
    }
    setIsEditMode(false);
    setError("");
  };

  const handleSave = () => {
    if (!editedAuction || !onUpdate || !auction) return;

    if (
      !editedAuction.title ||
      !editedAuction.currentBid ||
      !editedAuction.timeLeft
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Ensure we preserve the original ID and all fields
    const updatedAuction: Auction = {
      ...editedAuction,
      id: auction.id, // Preserve the original ID
      bidsCount: auction.bidsCount ?? 0, // Preserve bidsCount
    };

    onUpdate(updatedAuction);
    setIsEditMode(false);
    setError("");
  };

  if (!isOpen || !auction) return null;

  const categoryTitle = auction.categoryID
    ? (categories.find((c) => c.id === auction.categoryID)?.title ?? "")
    : "";

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      {/* Dark overlay - clickable to close */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
        onClick={!isEditMode ? onClose : undefined}
      />

      {/* Action buttons - top-right */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
        {!isEditMode && onUpdate && (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
            aria-label="Edit auction"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        )}
        {isEditMode && (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
              aria-label="Save changes"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
              aria-label="Cancel editing"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </>
        )}
        {!isEditMode && (
          <button
            onClick={onClose}
            className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
            aria-label="Close modal"
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
        )}
      </div>

      {/* Modal Content Card */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {isEditMode ? (
            /* Edit Mode */
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                  Edit Auction
                </h2>
                <p className="text-gray-600 text-sm">
                  Update the auction details below
                </p>
              </div>

              {editedAuction && (
                <>
                  <Input
                    label="Title"
                    value={editedAuction.title || ""}
                    onChange={(e) =>
                      setEditedAuction({
                        ...editedAuction,
                        title: e.target.value,
                      })
                    }
                    required
                    error={
                      error && !editedAuction.title
                        ? "Title is required"
                        : undefined
                    }
                  />

                  <div className="w-full space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-600 ml-1">*</span>
                    </label>
                    <select
                      value={editedAuction.categoryID || ""}
                      onChange={(e) =>
                        setEditedAuction({
                          ...editedAuction,
                          categoryID: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-colors"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Year"
                      value={editedAuction.year || ""}
                      onChange={(e) =>
                        setEditedAuction({
                          ...editedAuction,
                          year: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Time Left"
                      value={editedAuction.timeLeft || ""}
                      onChange={(e) =>
                        setEditedAuction({
                          ...editedAuction,
                          timeLeft: e.target.value,
                        })
                      }
                      required
                      error={
                        error && !editedAuction.timeLeft
                          ? "Time left is required"
                          : undefined
                      }
                    />
                  </div>

                  <Input
                    label="Current Bid"
                    value={editedAuction.currentBid || ""}
                    onChange={(e) =>
                      setEditedAuction({
                        ...editedAuction,
                        currentBid: e.target.value,
                      })
                    }
                    required
                    error={
                      error && !editedAuction.currentBid
                        ? "Current bid is required"
                        : undefined
                    }
                  />

                  <Input
                    label="Image URL"
                    value={editedAuction.image || ""}
                    onChange={(e) =>
                      setEditedAuction({
                        ...editedAuction,
                        image: e.target.value,
                      })
                    }
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* View Mode */
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                {auction.title}
              </h2>

              <div className="mt-6">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={auction.image}
                    alt={auction.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-800">
                      <span className="font-medium text-gray-600">
                        Current Bid:
                      </span>{" "}
                      {auction.currentBid}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Closes in</p>
                      <p className="text-gray-900 font-medium">
                        {auction.timeLeft}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bids</p>
                      <p className="text-gray-900 font-medium">
                        {auction.bidsCount || 0}
                      </p>
                    </div>
                  </div>
                  {categoryTitle && (
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-gray-900 font-medium">
                        {categoryTitle}
                      </p>
                    </div>
                  )}
                  {auction.year && (
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="text-gray-900 font-medium">
                        {auction.year}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
