import { getTranslations, getLocale } from "next-intl/server";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export default async function NotFound() {
  // Get locale from next-intl (works for not-found pages)
  let locale: string;
  try {
    locale = await getLocale();
  } catch {
    // Fallback to default locale if getLocale fails
    locale = routing.defaultLocale;
  }

  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden text-center">
          <div className="px-8 pt-12 pb-10">
            {/* 404 Icon + Text */}
            <div className="mx-auto w-20 h-20 mb-6">
              <ExclamationTriangleIcon
                className="w-full h-full text-amber-500"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {t("heading")}
            </h2>
            <p className="text-gray-600 mb-8">{t("description")}</p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/"
                locale={locale}
                className="inline-flex items-center justify-center w-full px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("goHome")}
              </Link>
            </div>
          </div>

          {/* Optional subtle footer */}
          <div className="bg-gray-50 px-8 py-5 text-center text-xs text-gray-500 border-t border-gray-100">
            {t("footer")}
          </div>
        </div>
      </div>
    </div>
  );
}
