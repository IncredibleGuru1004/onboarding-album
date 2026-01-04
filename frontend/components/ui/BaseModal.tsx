"use client";

import { ReactNode, useCallback } from "react";
import { useModal } from "@/hooks/useModal";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  zIndex?: number;
  preventScrollKeys?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

/**
 * Base modal component with shared functionality
 * Provides consistent styling, keyboard handling, and accessibility
 */
export function BaseModal({
  isOpen,
  onClose,
  children,
  maxWidth = "2xl",
  zIndex = 100,
  preventScrollKeys = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  closeButtonAriaLabel = "Close modal",
}: BaseModalProps) {
  useModal(isOpen, onClose, preventScrollKeys);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose],
  );

  if (!isOpen) return null;

  const closeButtonZIndex = zIndex + 1;
  const contentZIndex = zIndex + 1;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Close button */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ zIndex: closeButtonZIndex }}
          aria-label={closeButtonAriaLabel}
          type="button"
        >
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-xl w-full ${maxWidthClasses[maxWidth]} mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
        style={{ zIndex: contentZIndex }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
