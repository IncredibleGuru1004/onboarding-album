import React from "react";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export const NavigationButtons = () => {
  return (
    <div className="flex items-center gap-4">
      {/* Left Button - Previous */}
      <button
        aria-label="Previous"
        className="w-[54px] h-[54px] rounded-full border border-[#ececec] bg-white flex items-center justify-center shadow-md"
      >
        <ArrowLeftIcon className="w-5 h-5 text-[#505050]" />
      </button>

      {/* Right Button - Next */}
      <button
        aria-label="Next"
        className="w-[54px] h-[54px] rounded-full bg-[#ff7b29] flex items-center justify-center shadow-md"
      >
        <ArrowRightIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
