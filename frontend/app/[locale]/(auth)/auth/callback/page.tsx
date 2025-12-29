"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useTranslations } from "next-intl";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("common");
  const tGoogle = useTranslations("googleAuth");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're on a route without locale (shouldn't happen, but handle it)
    // The middleware should redirect, but just in case
    if (
      !pathname.includes("/en/") &&
      !pathname.includes("/fr/") &&
      !pathname.includes("/es/")
    ) {
      // Redirect to locale-aware version
      const token = searchParams.get("token");
      if (token) {
        router.push(`/en/auth/callback?token=${token}`);
        return;
      }
    }

    const token = searchParams.get("token");

    if (!token) {
      const errorMessage = "No token received from authentication provider";
      setError(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    // Store token in cookie by calling the API
    const storeToken = async () => {
      try {
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Failed to store token";
          throw new Error(errorMessage);
        }

        // Show success toast
        toast.success(
          tGoogle("signInSuccess") || "Successfully signed in with Google!",
        );

        // Redirect to dashboard using locale-aware router
        // The cookie is set, so auth state will be available on the dashboard
        router.push("/dashboard");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to complete authentication";
        setError(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    storeToken();
  }, [searchParams, router, pathname, tGoogle]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <p className="text-gray-600">{t("redirectingToLogin")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">{t("completingAuthentication")}</p>
      </div>
    </div>
  );
}
