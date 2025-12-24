import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

// Accepts a function to handle scrolling
interface NavigationButtonsProps {
  onScroll: (direction: "left" | "right") => void;
}

export const NavigationButtons = ({ onScroll }: NavigationButtonsProps) => {
  return (
    <div className="flex items-center gap-4">
      {/* Left Button - Previous */}
      <button
        aria-label="Previous"
        className="w-[54px] h-[54px] rounded-full border border-[#ececec] bg-white flex items-center justify-center shadow-md"
        onClick={() => {
          onScroll("left");
        }}
      >
        <ArrowLeftIcon className="w-5 h-5 text-[#505050]" />
      </button>

      {/* Right Button - Next */}
      <button
        aria-label="Next"
        className="w-[54px] h-[54px] rounded-full bg-[#ff7b29] flex items-center justify-center shadow-md"
        onClick={() => {
          onScroll("right");
        }}
      >
        <ArrowRightIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
