"use client";

import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isLoading) {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog Content */}
      <div className="relative bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{confirmText}</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
