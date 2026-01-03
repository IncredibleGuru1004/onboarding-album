import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const t = await getTranslations("login");
  return {
    title: t("logIn"),
    description: t("loginToContinue"),
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("login");

  // Check if user is already authenticated
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("authToken")?.value ||
    cookieStore.get("jwt")?.value;

  // If authenticated, redirect to dashboard
  if (token) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            {/* Back link – now using Heroicon */}
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("backToHome")}
            </Link>

            {/* Header */}
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {t("welcomeBack")}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t("loginToContinue")}
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 text-center text-sm text-gray-600 border-t border-gray-100">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {t("signUpHere")}
            </Link>
          </div>
        </div>

        {/* Optional subtle branding */}
        <p className="mt-8 text-center text-xs text-gray-500">{t("secured")}</p>
      </div>
    </div>
  );
}
