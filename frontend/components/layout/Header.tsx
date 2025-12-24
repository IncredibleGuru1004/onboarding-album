"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [currentSection, setCurrentSection] = useState<string>("home");
  const ignoreScrollRef = useRef(false);
  const ignoreTimerRef = useRef<number | null>(null);

  // Detect scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);

      if (ignoreScrollRef.current) return;

      const scrollMiddle = window.scrollY + window.innerHeight / 3;
      const collectionsEl = document.getElementById("collections");

      let active = "home";
      if (collectionsEl) {
        const top = collectionsEl.offsetTop;
        const bottom = top + collectionsEl.offsetHeight;
        if (scrollMiddle >= top && scrollMiddle < bottom) {
          active = "collections";
        }
      }

      setCurrentSection(active);
    };

    const handleHashChange = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      setCurrentSection(hash ? hash.slice(1) : "home");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleHashChange);
    handleScroll();
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      if (ignoreTimerRef.current) {
        clearTimeout(ignoreTimerRef.current);
        ignoreTimerRef.current = null;
      }
    };
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onHomeClick?.();
    window.history.pushState(null, "", "#home");
    setCurrentSection("home");
    // Ignore scroll updates briefly to avoid flicker while smooth-scrolling
    ignoreScrollRef.current = true;
    if (ignoreTimerRef.current) clearTimeout(ignoreTimerRef.current);
    ignoreTimerRef.current = window.setTimeout(() => {
      ignoreScrollRef.current = false;
      ignoreTimerRef.current = null;
    }, 600) as unknown as number;
  };

  const handleCollectionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCollectionsClick?.();
    window.history.pushState(null, "", "#collections");
    setCurrentSection("collections");
    // Ignore scroll updates briefly to avoid flicker while smooth-scrolling
    ignoreScrollRef.current = true;
    if (ignoreTimerRef.current) clearTimeout(ignoreTimerRef.current);
    ignoreTimerRef.current = window.setTimeout(() => {
      ignoreScrollRef.current = false;
      ignoreTimerRef.current = null;
    }, 600) as unknown as number;
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
                ${currentSection === "home" ? "text-[#2d3134]" : "text-[#6a6f77]"}
              `}
            >
              Home
              {currentSection === "home" && (
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
                <Button className="bg-[#ff7b29] text-white">
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
