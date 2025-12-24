"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  /** Optional content to display on the right side (e.g., navigation buttons, "View all" link) */
  rightContent?: React.ReactNode;
}

export const SectionTitle = ({
  title,
  subtitle,
  className = "",
  rightContent,
}: SectionTitleProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 ${className}`}
    >
      {/* Left side: Title + Subtitle */}
      <div className="flex-1">
        <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-[#2d3134]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[16px] font-inter text-[#6a6a6c]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side: Custom content or nothing */}
      {rightContent && <div className="flex items-center">{rightContent}</div>}
    </div>
  );
};
