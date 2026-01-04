"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
// import { Link } from "@/i18n/routing";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { setUser } from "@/store/authSlice";

export const LoginForm = () => {
  const t = useTranslations("login");
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError(t("emailRequired"));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("emailInvalid"));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t("passwordRequired"));
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(t("passwordMinLength"));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.message ?? t("invalidCredentials");
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();

      // Set user in Redux store
      if (data.user) {
        dispatch(setUser(data.user));
      }

      toast.success(t("loginSuccess") || "Login successful!");

      // Get redirect URL from query params or default to dashboard
      const redirectUrl = searchParams.get("redirect") || "/dashboard";
      router.push(redirectUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Email Field */}
      <Input
        id="email"
        label={t("emailAddress")}
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
        placeholder="you@example.com"
        required
        error={emailError}
        autoComplete="email"
      />

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            {t("password")}
            <span className="text-red-600 ml-1">*</span>
          </label>
          {/* <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t("forgotPassword")}
          </Link> */}
        </div>

        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          placeholder="••••••••"
          required
          error={passwordError}
          autoComplete="current-password"
          rightIcon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          }
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="mr-3 h-5 w-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t("loggingIn")}
          </span>
        ) : (
          t("logIn")
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">
            {t("orContinueWith") || "Or continue with"}
          </span>
        </div>
      </div>

      {/* Google Sign In Button */}
      <GoogleSignInButton
        text={t("signInWithGoogle") || "Sign in with Google"}
        disabled={isLoading}
      />
    </form>
  );
};
