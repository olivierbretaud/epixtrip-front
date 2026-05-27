"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLogout, useProfile } from "@/components/auth/hooks/auth";
import Logo from "@/components/ui/Logo/Logo";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
// comment

export default function Navbar() {
  const t = useTranslations("nav");
  const { data: profile } = useProfile();
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav className="flex h-14 z-20 fixed w-full bg-background items-center justify-between px-6">
      <Link href={"/travel"}>
        <Logo />
      </Link>
      <div className="flex items-center gap-3">
        <Link href={"/travel"} className="text-sm font-bold hover:underline">
          {t("myTravels")}
        </Link>
        {profile && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {getInitials(profile.firstName, profile.lastName)}
          </div>
        )}

        <button
          type="button"
          onClick={() => logout()}
          disabled={isPending}
          aria-label={t("logout")}
          className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
