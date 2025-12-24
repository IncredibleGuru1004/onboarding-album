"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";

export interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => Promise<void>;
  onHomeClick?: () => void;
  onCollectionsClick?: () => void;
}

export const Header = ({
  isAuthenticated = false,
  userName,
  onHomeClick,
  onCollectionsClick,
}: HeaderProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case page loads already scrolled
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const currentSection = hash ? hash.slice(1) : "home";

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onHomeClick?.();
    window.history.pushState(null, "", "#home");
  };

  const handleCollectionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCollectionsClick?.();
    window.history.pushState(null, "", "#collections");
  };

  return (
    <header
      className={`
        bg-white sticky top-0 z-40 transition-shadow duration-300
        ${hasScrolled ? "shadow-sm" : ""}
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-[#2d3134]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-inter">
              Siboria<span className="text-[#ff7b29]">.</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8 font-poppins font-medium text-base">
            <button
              onClick={handleHomeClick}
              className={`
                relative pb-[3px]
                ${currentSection === "hero" ? "text-[#2d3134]" : "text-[#6a6f77]"}
              `}
            >
              Home
              {currentSection === "hero" && (
                <span className="absolute left-[1px] bottom-0 w-[12px] h-[2px] bg-orange-500" />
              )}
            </button>

            <button
              onClick={handleCollectionsClick}
              className={`
                relative pb-[3px]
                ${currentSection === "collections" ? "text-[#2d3134]" : "text-[#6a6f77]"}
              `}
            >
              Collections
              {currentSection === "collections" && (
                <span className="absolute left-[1px] bottom-0 w-[12px] h-[2px] bg-orange-500" />
              )}
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {userName && (
                  <span className="text-base text-zinc-600">{userName}</span>
                )}
                <LogoutButton />
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-[#ff7b29] text-white" size="md">
                  Login / SignUp
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
