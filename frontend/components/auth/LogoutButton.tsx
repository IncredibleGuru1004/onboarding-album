"use client";

import { useTranslations } from "next-intl";

export const LogoutButton = () => {
  const t = useTranslations("auth");
  return <>{t("logout")}</>;
};
