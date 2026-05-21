import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Travel, TravelFormValues } from "@/types/travels";
import {
  useCreateTravel,
  useDeleteTravel,
  useUpdateTravel,
} from "../../hooks/travels";
import TravelForm from "../TravelForm";
import styles from "./TravelContent.module.scss";

export default function TravelContent({
  travel = null,
}: {
  travel?: Travel | null;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState<boolean>(!travel);
  const { mutate: updateTravel, isPending: updateIsPending } = useUpdateTravel(
    travel?.id,
  );

  const { mutateAsync: createTravel, isPending: createIsPending } =
    useCreateTravel();

  const { mutateAsync: deleteTravel, isPending: deleteIsPending } =
    useDeleteTravel();

  const onSubmit = async (values: TravelFormValues) => {
    if (!travel?.id) {
      const created = await createTravel(values);
      setIsEdit(false);
      toast.success(t("travel.created"));
      router.push(`/travel/${created?.id}`);
      return;
    }
    await updateTravel(values);
    setIsEdit(false);
    return toast.success(t("travel.updated"));
  };

  const handleDeleteTravel = async () => {
    if (!travel?.id) return;
    await deleteTravel(travel.id);
    toast.success(t("travel.deleted"));
    router.push("/travel");
  };

  return (
    <div className={styles.travelContent}>
      <header>
        <h2>{travel?.title || t("travel.new")}</h2>
        {!isEdit && (
          <Button onClick={() => setIsEdit(true)}>{t("btn.edit")}</Button>
        )}
      </header>
      {!isEdit && travel?.description && (
        <p className={styles?.description}>{travel?.description}</p>
      )}
      {isEdit && (
        <TravelForm
          isPending={updateIsPending || createIsPending || deleteIsPending}
          defaultValues={travel || {}}
          onSubmit={onSubmit}
          cancel={() => setIsEdit(false)}
          deleteTravel={travel?.id ? handleDeleteTravel : null}
        />
      )}
    </div>
  );
}
