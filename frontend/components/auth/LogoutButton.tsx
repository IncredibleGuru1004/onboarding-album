"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/auth";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
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
