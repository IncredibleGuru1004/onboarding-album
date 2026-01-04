"use client";

import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { RootState, AppDispatch } from "@/store/store";
import { selectConfirmDialog, closeConfirmDialog } from "@/store/uiSlice";
import { deleteCategoryThunk } from "@/store/categorySlice";
import { deleteAuctionThunk } from "@/store/auctionSlice";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { BaseModal } from "./BaseModal";
import { useModal } from "@/hooks/useModal";

/**
 * Confirm dialog modal component for delete confirmations
 * Handles both category and auction deletions
 */
export default function ConfirmDialogModal() {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const confirmDialog = useSelector(selectConfirmDialog);
  const isLoading = useSelector(
    (state: RootState) =>
      state.categories.isLoading || state.auctions.isLoading,
  );

  // Use modal hook for keyboard handling (without scroll prevention)
  useModal(confirmDialog.isOpen, () => dispatch(closeConfirmDialog()), false);

  // Memoized handlers
  const handleClose = useCallback(() => {
    if (!isLoading) {
      dispatch(closeConfirmDialog());
    }
  }, [dispatch, isLoading]);

  const handleConfirm = useCallback(async () => {
    if (!confirmDialog.type || confirmDialog.id === null || isLoading) return;

    try {
      if (confirmDialog.type === "category") {
        await dispatch(
          deleteCategoryThunk(confirmDialog.id as string),
        ).unwrap();
        toast.success(
          t("sidebar.categoryDeleted") || "Category deleted successfully",
        );
      } else if (confirmDialog.type === "auction") {
        await dispatch(deleteAuctionThunk(confirmDialog.id as number)).unwrap();
        toast.success(
          t("myAuctions.auctionDeleted") || "Auction deleted successfully",
        );
      }
      dispatch(closeConfirmDialog());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(errorMessage);
    }
  }, [confirmDialog.type, confirmDialog.id, isLoading, dispatch, t]);

  // Memoized loading state check
  const canClose = useMemo(() => !isLoading, [isLoading]);

  if (!confirmDialog.isOpen) return null;

  return (
    <BaseModal
      isOpen={confirmDialog.isOpen}
      onClose={handleClose}
      maxWidth="md"
      zIndex={50}
      preventScrollKeys={false}
      closeOnOverlayClick={canClose}
      showCloseButton={false}
    >
      <div className="p-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <ExclamationTriangleIcon
            className="w-6 h-6 text-red-600"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {confirmDialog.title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {confirmDialog.message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="button"
          >
            {confirmDialog.cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            type="button"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{confirmDialog.confirmText}</span>
              </>
            ) : (
              confirmDialog.confirmText
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
