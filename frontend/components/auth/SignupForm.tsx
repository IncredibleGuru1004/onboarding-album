"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export const SignupForm = () => {
  const t = useTranslations("register");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Field-level errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Global messages
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Name is optional, but if provided, validate it
    if (name.trim() && name.trim().length < 2) {
      setNameError(t("nameMinLength") || "Name must be at least 2 characters");
      isValid = false;
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError(t("confirmPasswordRequired"));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t("passwordsDoNotMatch"));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);

    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmPassword", confirmPassword);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? t("registrationFailed"));
      }

      await response.json();
      setSuccess(t("accountCreated"));

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : t("somethingWentWrong"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name */}
      <Input
        id="name"
        label={t("name") || "Full Name"}
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNameError("");
          setServerError("");
        }}
        placeholder={t("enterName") || "Enter your name (optional)"}
        error={nameError}
        autoComplete="name"
      />

      {/* Email */}
      <Input
        id="email"
        label={t("emailAddress")}
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

      {/* Password */}
      <Input
        id="password"
        label={t("password")}
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
          setServerError("");
          // Re-validate confirm if already filled
          if (confirmPassword && e.target.value !== confirmPassword) {
            setConfirmPasswordError(t("passwordsDoNotMatch"));
          } else {
            setConfirmPasswordError("");
          }
        }}
        placeholder="••••••••"
        required
        error={passwordError}
        autoComplete="new-password"
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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

      {/* Confirm Password */}
      <Input
        id="confirmPassword"
        label={t("confirmPassword")}
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setConfirmPasswordError("");
          setServerError("");
        }}
        placeholder="••••••••"
        required
        error={confirmPasswordError}
        autoComplete="new-password"
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            aria-label={
              showConfirmPassword ? t("hidePassword") : t("showPassword")
            }
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        }
      />

      {/* Server Error – already using Heroicon */}
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

      {/* Success Message – NOW USING HEROICON */}
      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircleIcon
            className="h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          />
          <span>{success}</span>
        </div>
      )}

      {/* Submit Button and Login Link – unchanged */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? t("creatingAccount") : t("signUp")}
      </Button>
    </form>
  );
};
