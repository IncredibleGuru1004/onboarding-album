"use client";

import { ReactNode } from "react";

interface ModalHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Reusable modal header component
 */
export function ModalHeader({
  title,
  description,
  children,
}: ModalHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
      {children}
    </div>
  );
}
