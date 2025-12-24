import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { ArrowLeftIcon } from "@heroicons/react/24/solid"; // ← Heroicon

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            {/* Back link with Heroicon */}
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              Back to Home
            </Link>

            {/* Header */}
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join us and get started today
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              <SignupForm />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 text-center text-sm text-gray-600 border-t border-gray-100">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Optional subtle branding */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Secured by industry-standard encryption
        </p>
      </div>
    </div>
  );
}
