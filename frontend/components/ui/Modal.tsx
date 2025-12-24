import Image from "next/image";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  currentBid: string;
  timeLeft: string;
  bidsCount: number;
  category: string;
  year: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  image,
  currentBid,
  timeLeft,
  bidsCount,
  category,
  year,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Dark overlay - clickable to close */}
      <div className="absolute inset-0 bg-gray-900/80" onClick={onClose} />

      {/* Close button - completely outside the card, top-right of the screen */}
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

      {/* Modal Content Card - clean white square, no close button inside */}
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
        <div className="p-8 pt-10">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>

          <div className="mt-6">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
                priority
              />
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-lg text-gray-800">
                <span className="font-medium text-gray-600">Current Bid:</span>{" "}
                {currentBid}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Closes in:</span> {timeLeft}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Bids:</span> {bidsCount}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Category:</span> {category}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Year:</span> {year}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
