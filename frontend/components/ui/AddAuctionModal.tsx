"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { Auction } from "@/types/auction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuctions } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "./Input";
import { Button } from "./Button";
import ImageUpload from "./ImageUpload";
import { toast } from "react-toastify";

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
  const t = useTranslations("addAuction");
  const { addAuction, isLoading } = useAuctions();
  const { user } = useAuth();
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [year, setYear] = useState("");
  const [currentBid, setCurrentBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  // Store previous form state
  const savedStateRef = useRef({
    title: "",
    categoryID: "",
    year: "",
    currentBid: "",
    timeLeft: "",
    image: "",
    imageFile: null as File | null,
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
        imageFile,
      };
    }
  }, [isOpen, title, categoryID, year, currentBid, timeLeft, image, imageFile]);

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
        imageFile,
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
    setImageFile(null);
    setError("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validate required fields (title and image are required by backend)
    if (!title || !image) {
      setError(t("fillRequiredFields"));
      return;
    }

    try {
      // Create auction data for API
      const auctionData = {
        title,
        image,
        categoryID: categoryID || undefined,
        userId: user?.id || undefined,
      };

      // Call backend API through Redux
      const newAuction = await addAuction(auctionData);

      // Success! Show toast
      toast.success(t("auctionCreated") || "Auction created successfully!");

      // Call parent callback (for compatibility)
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
        imageFile: null,
      };
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create auction";
      setError(errorMessage);
      toast.error(errorMessage);
    }
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

      {/* Modal Content Card */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              {t("addNewAuction")}
            </h2>
            <p className="text-gray-600 text-sm">{t("fillDetails")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t("title")}
              placeholder={t("enterTitle")}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              required
              error={error && !title ? t("titleRequired") : undefined}
            />

            <div className="w-full space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {t("category")} <span className="text-red-600 ml-1">*</span>
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
                <option value="">{t("selectCategory")}</option>
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
                  {t("categoryRequired")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label={t("year")}
                placeholder={t("yearPlaceholder")}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  if (error) setError("");
                }}
              />

              <Input
                label={t("timeLeft")}
                placeholder={t("timeLeftPlaceholder")}
                value={timeLeft}
                onChange={(e) => {
                  setTimeLeft(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>

            <ImageUpload
              label={t("image") || "Image"}
              value={image}
              onChange={(imageUrl) => {
                setImage(imageUrl);
                if (error) setError("");
              }}
              onFileChange={(file) => {
                setImageFile(file);
              }}
              required
              error={
                error && !image
                  ? t("imageUrlRequired") || "Image is required"
                  : undefined
              }
            />

            <Input
              label={t("currentBid")}
              placeholder={t("currentBidPlaceholder")}
              value={currentBid}
              onChange={(e) => {
                setCurrentBid(e.target.value);
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
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? t("adding") || "Adding..." : t("addAuction")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuctionModal;
