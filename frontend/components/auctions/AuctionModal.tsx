"use client";

import { useMemo, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { RootState, AppDispatch } from "@/store/store";
import { useAuctions } from "@/hooks/useAuctions";
import { selectAuctionModal, closeAuctionModal } from "@/store/auctionSlice";
import { useModalFormReset, useModalCloseHandler } from "@/hooks/useModal";
import { BaseModal } from "@/components/ui/BaseModal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "react-toastify";
import {
  validateRequired,
  validateExists,
  combineValidations,
} from "@/utils/validation";

interface AuctionFormData {
  title: string;
  categoryID: string;
  year: string;
  currentBid: string;
  timeLeft: string;
  image: string;
}

const initialFormData: AuctionFormData = {
  title: "",
  categoryID: "",
  year: "",
  currentBid: "",
  timeLeft: "",
  image: "",
};

/**
 * Auction modal component for creating and editing auctions
 * Uses Redux for state management and follows senior-level patterns
 */
export default function AuctionModal() {
  const t = useTranslations("addAuction");
  const dispatch = useDispatch<AppDispatch>();
  const { addAuction, updateAuction, isLoading } = useAuctions();
  const modal = useSelector(selectAuctionModal);
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [formData, setFormData] = useState<AuctionFormData>(initialFormData);
  const [error, setError] = useState<string>("");

  const isOpen = modal.isOpen;
  const isEditMode = modal.mode === "edit";
  const editingAuction = modal.editingAuction;

  // Memoized values
  const modalTitle = useMemo(
    () => (isEditMode ? t("editAuction") : t("addNewAuction")),
    [isEditMode, t],
  );

  const modalDescription = useMemo(
    () => (isEditMode ? t("updateDetails") : t("fillDetails")),
    [isEditMode, t],
  );

  // Initialize form when modal opens
  useModalFormReset(isOpen, () => {
    if (isEditMode && editingAuction) {
      setFormData({
        title: editingAuction.title,
        categoryID: editingAuction.categoryID || "",
        year: editingAuction.year || "",
        currentBid: editingAuction.currentBid || "",
        timeLeft: editingAuction.timeLeft || "",
        image: editingAuction.image || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setError("");
  }, [isEditMode, editingAuction?.id]);

  // Close handler with error clearing
  const handleClose = useModalCloseHandler(
    () => dispatch(closeAuctionModal()),
    () => setError(""),
  );

  // Form field handlers
  const updateField = useCallback(
    <K extends keyof AuctionFormData>(field: K, value: AuctionFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) setError("");
    },
    [error],
  );

  // Validation
  const validateForm = useCallback((): boolean => {
    const titleValidation = validateRequired(formData.title, t("title"));
    const imageValidation = validateExists(formData.image, t("image"));

    const combined = combineValidations(titleValidation, imageValidation);

    if (!combined.isValid) {
      setError(combined.error || t("fillRequiredFields"));
      return false;
    }

    return true;
  }, [formData.title, formData.image, t]);

  // Submit handler
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        // Backend automatically extracts userId from JWT token
        // No need to send it in the request body
        const auctionData = {
          title: formData.title.trim(),
          image: formData.image,
          categoryID: formData.categoryID || undefined,
        };

        if (isEditMode && editingAuction) {
          await updateAuction(editingAuction.id, auctionData);
          toast.success(t("auctionUpdated") || "Auction updated successfully!");
        } else {
          await addAuction(auctionData);
          toast.success(t("auctionCreated") || "Auction created successfully!");
        }

        handleClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save auction";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [
      formData,
      isEditMode,
      editingAuction,
      validateForm,
      updateAuction,
      addAuction,
      handleClose,
      t,
    ],
  );

  const submitButtonText = useMemo(() => {
    if (isLoading) {
      return isEditMode ? t("saving") : t("adding");
    }
    return isEditMode ? t("saveChanges") : t("addAuction");
  }, [isLoading, isEditMode, t]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonAriaLabel={t("closeModal")}
    >
      <div className="p-8">
        <ModalHeader title={modalTitle} description={modalDescription} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label={t("title")}
            placeholder={t("enterTitle")}
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
            error={error && !formData.title ? t("titleRequired") : undefined}
            autoFocus
          />

          {/* Category Select */}
          <div className="w-full space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t("category")} <span className="text-red-600 ml-1">*</span>
            </label>
            <select
              value={formData.categoryID}
              onChange={(e) => updateField("categoryID", e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                error && !formData.categoryID
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            {error && !formData.categoryID && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
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
              value={formData.year}
              onChange={(e) => updateField("year", e.target.value)}
            />

            <Input
              label={t("timeLeft")}
              placeholder={t("timeLeftPlaceholder")}
              value={formData.timeLeft}
              onChange={(e) => updateField("timeLeft", e.target.value)}
            />
          </div>

          <ImageUpload
            label={t("image") || "Image"}
            value={formData.image}
            onChange={(value) => updateField("image", value)}
            required
            error={
              error && !formData.image
                ? t("imageUrlRequired") || "Image is required"
                : undefined
            }
          />

          <Input
            label={t("currentBid")}
            placeholder={t("currentBidPlaceholder")}
            value={formData.currentBid}
            onChange={(e) => updateField("currentBid", e.target.value)}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <ModalFooter
            onCancel={handleClose}
            onConfirm={handleSubmit}
            cancelText={t("cancel")}
            confirmText={submitButtonText}
            isLoading={isLoading}
          />
        </form>
      </div>
    </BaseModal>
  );
}
