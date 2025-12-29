"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

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

    if (!validateForm()) return;

    setIsLoading(true);

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
        const errorMessage = data.message ?? t("registrationFailed");
        toast.error(errorMessage);
        return;
      }

      await response.json();
      toast.success(t("accountCreated") || "Account created successfully!");

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("somethingWentWrong"));
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

      {/* Submit Button and Login Link – unchanged */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? t("creatingAccount") : t("signUp")}
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
        text={t("signUpWithGoogle") || "Sign up with Google"}
        disabled={isLoading}
      />
    </form>
  );
};
