"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/auth";
import { clearUser } from "@/store/authSlice";

interface LogoutButtonProps {
  className?: string;
  variant?: "button" | "link";
}

export const LogoutButton = ({
  className = "",
  variant = "button",
}: LogoutButtonProps) => {
  const t = useTranslations("auth");
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      // Clear user from Redux store
      dispatch(clearUser());
      toast.success(t("logoutSuccess") || "Logged out successfully!");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("logoutFailed") || "Failed to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "link") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 ${className}`}
      >
        {isLoading ? t("loggingOut") || "Logging out..." : t("logout")}
      </button>
    );
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
      variant="outlined"
    >
      {isLoading ? t("loggingOut") || "Logging out..." : t("logout")}
    </Button>
  );
};
