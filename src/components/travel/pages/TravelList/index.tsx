"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { cn } from "@/lib/utils";
import type { Travel } from "@/types/travels";
import TravelCard from "../../components/TravelCard";
import { useGetTravels } from "../../hooks/travels";
import styles from "./TravelList.module.scss";

const TravelList = () => {
  const t = useTranslations("travel");
  const { data: travels, isLoading } = useGetTravels();
  return (
    <div className={styles.travels}>
      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <Link
          href="/travel/create"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "w-full mb-6",
          )}
        >
          <Plus />
          {t("create")}
        </Link>
      )}
      {travels?.map((t: Travel) => (
        <TravelCard key={`travel-${t.id}`} travel={t} />
      ))}
    </div>
  );
};

export default TravelList;
