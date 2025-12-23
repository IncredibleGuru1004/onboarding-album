"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";

type Tab = "home" | "collections";

export interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => Promise<void>;
  // Optional: allow parent to control initial tab or get updates
  initialTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export const Header = ({
  isAuthenticated = false,
  userName,
  initialTab = "home",
  onTabChange,
}: HeaderProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange?.(tab); // Notify parent if needed
  };

  return (
    <header className="bg-white dark:bg-zinc-900 dark:border-zinc-800 sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-[#2d3134]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-inter">
              Siboria<span className="text-[#ff7b29]">.</span>
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-8 font-poppins font-medium text-base">
            <button
              onClick={() => handleTabClick("home")}
              className={`
                relative pb-[3px]
                ${activeTab === "home" ? "text-[#2d3134]" : "text-[#6a6f77]"}
              `}
            >
              Home
              {activeTab === "home" && (
                <span
                  className="absolute left-[1px] bottom-0 w-[12px] h-[2px] bg-orange-500"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              onClick={() => handleTabClick("collections")}
              className={`
                relative pb-[3px]
                ${
                  activeTab === "collections"
                    ? "text-[#2d3134]"
                    : "text-[#6a6f77]"
                }
              `}
            >
              Collections
              {activeTab === "collections" && (
                <span
                  className="absolute left-[1px] bottom-0 w-[12px] h-[2px] bg-orange-500"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {userName && (
                  <span className="text-base text-zinc-600 dark:text-zinc-400">
                    {userName}
                  </span>
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
