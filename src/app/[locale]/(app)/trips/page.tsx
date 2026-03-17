import { getTranslations } from "next-intl/server";

export default async function TripsPage() {
  const t = await getTranslations("trips");
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
