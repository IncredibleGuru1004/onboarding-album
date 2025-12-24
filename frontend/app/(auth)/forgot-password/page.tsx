"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    // Simple validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Placeholder API call (replace with real one when ready)
    // await fetch("/api/auth/forgot-password", { ... });

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            {/* Back Link */}
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              Back to Log in
            </Link>

            {/* Header */}
            <div className="mt-8 text-center">
              <div className="mx-auto w-16 h-16 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <EnvelopeIcon
                  className="w-8 h-8 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Forgot your password?
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                No worries! Enter your email and we'll send you reset
                instructions.
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <Input
                    id="email"
                    label="Email address"
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
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send reset instructions"}
                  </Button>
                </form>
              ) : (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-5 text-sm text-green-800"
                >
                  <CheckCircleIcon
                    className="h-6 w-6 flex-shrink-0 text-green-600 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">Password reset email sent!</p>
                    <p className="mt-1">
                      If an account exists for{" "}
                      <span className="font-semibold">{email}</span>, you will
                      receive an email with instructions shortly.
                    </p>
                    <p className="mt-2 text-green-700">
                      Check your inbox (and spam/junk folder). The link expires
                      in 1 hour.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 text-center text-sm text-gray-600 border-t border-gray-100">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Subtle security note */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Secured by industry-standard encryption
        </p>
      </div>
    </div>
  );
}
