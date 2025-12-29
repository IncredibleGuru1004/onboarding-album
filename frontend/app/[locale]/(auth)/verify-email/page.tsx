"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "pending"
  >("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    // If email is provided but no token, show pending verification message
    if (emailParam && !token) {
      setEmail(emailParam);
      setStatus("pending");
      return;
    }

    // If no token and no email, show error
    if (!token) {
      setStatus("error");
      setMessage(t("noVerificationToken") || "No verification token provided");
      return;
    }

    // Verify email with backend (only if token exists)
    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            data.message || t("verificationFailed") || "Verification failed",
          );
        }

        const data = await response.json();

        // Store token in cookie using the callback API
        const storeTokenResponse = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.accessToken }),
          credentials: "include",
        });

        if (!storeTokenResponse.ok) {
          throw new Error("Failed to store authentication token");
        }

        setStatus("success");
        setMessage(
          t("emailVerified") ||
            "Email verified successfully! Redirecting to dashboard...",
        );

        // Redirect to dashboard after successful verification
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : t("verificationFailed") || "Failed to verify email",
        );
      }
    };

    // Only call verifyEmail if we have a token
    if (token) {
      verifyEmail();
    }
  }, [searchParams, router, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("backToHome") || "Back to Home"}
            </Link>

            {/* Content */}
            <div className="mt-8 text-center">
              {status === "pending" && (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                    <svg
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    {t("checkYourEmail") || "Check Your Email"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t("verificationEmailSentMessage") ||
                      "We've sent a verification link to"}
                  </p>
                  {email && (
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {email}
                    </p>
                  )}
                  <p className="mt-4 text-sm text-gray-600">
                    {t("clickLinkToVerify") ||
                      "Please click the link in the email to verify your account and access the dashboard."}
                  </p>
                  <div className="mt-6 space-y-3">
                    <Link
                      href="/login"
                      className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                    >
                      {t("goToLogin") || "Go to Login"}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {t("didntReceiveEmail") || "Didn't receive the email?"}{" "}
                      <Link
                        href="/register"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {t("tryAgain") || "Try again"}
                      </Link>
                    </p>
                  </div>
                </>
              )}

              {status === "loading" && (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 animate-pulse">
                    <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    {t("verifyingEmail") || "Verifying your email..."}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t("pleaseWait") ||
                      "Please wait while we verify your email address."}
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    {t("emailVerified") || "Email Verified!"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">{message}</p>
                  <p className="mt-4 text-sm text-gray-500">
                    {t("redirectingToDashboard") ||
                      "Redirecting to dashboard..."}
                  </p>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                    <XCircleIcon className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    {t("verificationFailed") || "Verification Failed"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">{message}</p>
                  <div className="mt-6 space-y-3">
                    <Link
                      href="/login"
                      className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                    >
                      {t("goToLogin") || "Go to Login"}
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-base font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                    >
                      {t("createNewAccount") || "Create New Account"}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
