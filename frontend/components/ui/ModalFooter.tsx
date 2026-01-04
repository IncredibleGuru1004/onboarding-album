"use client";

import { ReactNode } from "react";
import { Button } from "./Button";

interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  confirmVariant?: "primary" | "danger";
  children?: ReactNode;
}

/**
 * Reusable modal footer component with action buttons
 */
export function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  isLoading = false,
  confirmVariant = "primary",
  children,
}: ModalFooterProps) {
  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
      {children}
      <Button
        variant="outlined"
        onClick={onCancel}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
        disabled={isLoading}
        type="button"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        onClick={onConfirm}
        className={confirmButtonClass}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {confirmText}
          </span>
        ) : (
          confirmText
        )}
      </Button>
    </div>
  );
}
