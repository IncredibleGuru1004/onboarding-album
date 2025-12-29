"use client";

import { AuthInitializer } from "@/components/auth/AuthInitializer";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
