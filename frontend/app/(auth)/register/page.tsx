import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </Link>
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
