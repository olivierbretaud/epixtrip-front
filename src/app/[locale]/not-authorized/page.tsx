import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotAuthorized() {
  const t = await getTranslations("errors.notAuthorized");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">401</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link href="/" className="text-sm underline underline-offset-4">
        {t("back")}
      </Link>
    </div>
  );
}
