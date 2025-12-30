"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "@/lib/auth";
import { clearUser } from "@/store/authSlice";
import {
  UserCircleIcon,
  ChevronDownIcon,
  RectangleStackIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface UserMenuProps {
  userName: string;
}

export const UserMenu = ({ userName }: UserMenuProps) => {
  const t = useTranslations("userMenu");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    try {
      await logout();
      dispatch(clearUser());
      toast.success(tAuth("logoutSuccess") || "Logged out successfully!");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        tAuth("logoutFailed") || "Failed to log out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserCircleIcon className="w-6 h-6 text-gray-600" />
        <span className="text-base text-gray-700 font-medium max-w-[150px] truncate">
          {userName}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500 mt-1">{t("signedIn")}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* My Auctions */}
            <Link
              href="/my-auctions"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RectangleStackIcon className="w-5 h-5 text-gray-500" />
              <span>{t("myAuctions")}</span>
            </Link>

            {/* Divider */}
            <div className="my-1 border-t border-gray-100" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500" />
              <span>
                {isLoggingOut
                  ? tAuth("loggingOut") || "Logging out..."
                  : t("logout")}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
