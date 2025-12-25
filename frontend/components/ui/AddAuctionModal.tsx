"use client";

import { useEffect, useState, useRef } from "react";
import { Auction } from "@/types/auction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Input } from "./Input";
import { Button } from "./Button";

interface AddAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAuction: (auction: Auction) => void;
}

const AddAuctionModal = ({
  isOpen,
  onClose,
  onAddAuction,
}: AddAuctionModalProps) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [year, setYear] = useState("");
  const [currentBid, setCurrentBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  // Store previous form state
  const savedStateRef = useRef({
    title: "",
    categoryID: "",
    year: "",
    currentBid: "",
    timeLeft: "",
    image: "",
  });

  // Save state continuously while modal is open (for future use if needed)
  useEffect(() => {
    if (isOpen) {
      // Continuously save form state while modal is open
      savedStateRef.current = {
        title,
        categoryID,
        year,
        currentBid,
        timeLeft,
        image,
      };
    }
  }, [isOpen, title, categoryID, year, currentBid, timeLeft, image]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Clear form content and error when modal opens
      resetForm();
    } else {
      // Save current state when modal closes (before clearing)
      savedStateRef.current = {
        title,
        categoryID,
        year,
        currentBid,
        timeLeft,
        image,
      };
      // Clear error when modal closes
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only run when isOpen changes, not on every field change

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
        // Prevent scrolling with arrow keys when modal is open
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

  const resetForm = () => {
    setTitle("");
    setCategoryID("");
    setYear("");
    setCurrentBid("");
    setTimeLeft("");
    setImage("");
    setError("");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!title || !categoryID || !currentBid || !timeLeft) {
      setError("Please fill in all required fields.");
      return;
    }

    const newAuction: Auction = {
      id: Date.now(),
      title,
      categoryID,
      year,
      currentBid,
      timeLeft,
      image: image || "/images/auctions/rolex.png",
      bidsCount: 0,
    };

    onAddAuction(newAuction);
    // Reset form and saved state when successfully submitted
    resetForm();
    savedStateRef.current = {
      title: "",
      categoryID: "",
      year: "",
      currentBid: "",
      timeLeft: "",
      image: "",
    };
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay - clickable to close */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button - top-right */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-30 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110"
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

      {/* Modal Content Card */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Add New Auction
            </h2>
            <p className="text-gray-600 text-sm">
              Fill in the details below to create a new auction listing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              placeholder="Enter auction title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              required
              error={error && !title ? "Title is required" : undefined}
            />

            <div className="w-full space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-600 ml-1">*</span>
              </label>
              <select
                value={categoryID}
                onChange={(e) => {
                  setCategoryID(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error && !categoryID
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              {error && !categoryID && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Category is required
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Year"
                placeholder="e.g. 2023"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  if (error) setError("");
                }}
              />

              <Input
                label="Time Left"
                placeholder="e.g. 2d 5h"
                value={timeLeft}
                onChange={(e) => {
                  setTimeLeft(e.target.value);
                  if (error) setError("");
                }}
                required
                error={error && !timeLeft ? "Time left is required" : undefined}
              />
            </div>

            <Input
              label="Current Bid"
              placeholder="e.g. $500"
              value={currentBid}
              onChange={(e) => {
                setCurrentBid(e.target.value);
                if (error) setError("");
              }}
              required
              error={
                error && !currentBid ? "Current bid is required" : undefined
              }
            />

            <Input
              label="Image URL"
              placeholder="https://example.com/image.png (optional)"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                if (error) setError("");
              }}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outlined"
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Auction
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuctionModal;
