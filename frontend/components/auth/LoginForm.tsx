"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

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
        throw new Error(data.message ?? "Invalid email or password");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
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
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
          setServerError("");
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
            Password<span className="text-red-600 ml-1">*</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
            setServerError("");
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
              aria-label={showPassword ? "Hide password" : "Show password"}
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

      {/* Server Error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <ExclamationCircleIcon
            className="h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          />
          <span>{serverError}</span>
        </div>
      )}

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
            Logging in...
          </span>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
};
