import { useEffect, useCallback } from "react";

/**
 * Hook to manage modal keyboard interactions and body scroll lock
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 * @param preventScrollKeys - Whether to prevent scrolling with arrow keys (default: true)
 */
export function useModal(
  isOpen: boolean,
  onClose: () => void,
  preventScrollKeys = true,
) {
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    document.body.classList.add("overflow-hidden");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Prevent scrolling with navigation keys when modal is open
      if (preventScrollKeys) {
        const scrollKeys = [
          "ArrowUp",
          "ArrowDown",
          "Space",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ];

        if (scrollKeys.includes(e.key)) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, preventScrollKeys]);
}

/**
 * Hook to reset form state when modal opens/closes
 * @param isOpen - Whether the modal is open
 * @param resetFn - Function to reset form state
 */
export function useModalFormReset<T>(
  isOpen: boolean,
  resetFn: () => T,
  dependencies: unknown[] = [],
) {
  useEffect(() => {
    if (isOpen) {
      resetFn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ...dependencies]);
}

/**
 * Creates a memoized close handler that clears error state
 */
export function useModalCloseHandler(
  onClose: () => void,
  clearError: () => void,
) {
  return useCallback(() => {
    clearError();
    onClose();
  }, [onClose, clearError]);
}
