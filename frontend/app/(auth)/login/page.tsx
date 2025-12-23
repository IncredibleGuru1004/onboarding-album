import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In",
  description: "Log in to your account",
};

export default function LoginPage() {
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
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>

            {/* Header */}
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Log in to your account to continue
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 text-center text-sm text-gray-600 border-t border-gray-100">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up here
            </Link>
          </div>
        </div>

        {/* Optional subtle branding or illustration */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Secured by industry-standard encryption
        </p>
      </div>
    </div>
  );
}
