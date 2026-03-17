"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/api/auth/useLogout";
import { useProfile } from "@/api/auth/useProfile";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
// comment

export default function Navbar() {
  const t = useTranslations("nav");
  const { data: profile } = useProfile();
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav className="flex h-14 items-center justify-between border-b px-6">
      <span className="font-semibold">Epixtrip</span>

      <div className="flex items-center gap-3">
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
