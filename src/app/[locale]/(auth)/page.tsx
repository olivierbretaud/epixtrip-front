"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { useProfile } from "@/components/auth/hooks/auth";
import { routing } from "@/i18n/routing";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const { data: profile, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) return;
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    router.replace(profile ? `${prefix}/travel` : `${prefix}/login`);
  }, [isLoading, profile, router, locale]);

  return null;
}
