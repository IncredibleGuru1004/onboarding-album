"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/layout/UserMenu";
import { Link } from "@/i18n/routing";
import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "@/store/authSlice";

export interface HeaderProps {
  isAuthenticated?: boolean; // Optional: can be overridden, but will use useAuth if not provided
  userName?: string; // Optional: will use user from useAuth if not provided
  onLogout?: () => Promise<void>; // Optional: will use useAuth logout if not provided
  onHomeClick?: () => void;
  onCollectionsClick?: () => void;
  showNavLinks?: boolean; // Add this prop to control navigation link visibility
}

export const Header = ({
  isAuthenticated: propIsAuthenticated,
  userName: propUserName,
  onHomeClick,
  onCollectionsClick,
  showNavLinks = true, // Default to showing the nav links
}: HeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("header");

  // Get user info from Redux store
  const user = useSelector(selectUser);
  const reduxIsAuthenticated = useSelector(selectIsAuthenticated);

  // Use props if provided, otherwise use Redux values
  const isAuthenticated =
    propIsAuthenticated ?? (mounted ? reduxIsAuthenticated : false);
  const userName =
    propUserName ?? (mounted ? user?.name || user?.email || "" : "");

  // Mark component as mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const [hasScrolled, setHasScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("home");
  const ignoreScrollRef = useRef(false);
  const ignoreTimerRef = useRef<number | null>(null);

  // Detect scroll position and active section (only after mount)
  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted]);

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
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-[#2d3134]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-inter">
              Siboria<span className="text-[#ff7b29]">.</span>
            </span>
          </div>

          {/* Navigation Links - Conditionally render based on showNavLinks */}
          {showNavLinks && (
            <div className="flex items-center gap-8 font-poppins font-medium text-base">
              <button
                onClick={handleHomeClick}
                className={`
                  relative pb-[3px]
                  ${currentSection === "home" ? "text-[#2d3134]" : "text-[#6a6f77]"}
                `}
              >
                {t("home")}
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
                {t("collections")}
                {currentSection === "collections" && (
                  <span className="absolute left-[1px] bottom-0 w-[12px] h-[2px] bg-orange-500" />
                )}
              </button>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!mounted ? (
              // Show default state during SSR to prevent hydration mismatch
              <Link href="/login">
                <Button className="bg-[#ff7b29] text-white">
                  {t("loginSignUp")}
                </Button>
              </Link>
            ) : isAuthenticated ? (
              <UserMenu userName={userName} />
            ) : (
              <Link href="/login">
                <Button className="bg-[#ff7b29] text-white">
                  {t("loginSignUp")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
