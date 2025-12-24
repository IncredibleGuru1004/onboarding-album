"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Field-level errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Global messages
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      isValid = false;
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
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

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message ?? "Registration failed. Please try again.",
        );
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Username */}
      <Input
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError("");
          setServerError("");
        }}
        placeholder="Choose a username"
        required
        error={usernameError}
        autoComplete="username"
      />

      {/* Email */}
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

      {/* Password */}
      <Input
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
          setServerError("");
          // Re-validate confirm if already filled
          if (confirmPassword && e.target.value !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
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

      {/* Confirm Password */}
      <Input
        id="confirmPassword"
        label="Confirm Password"
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
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
};
