import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useTravelMap } from "@/components/layouts/app/TravelMapContext";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@/hooks/useWindowSize";
import type { Travel, TravelFormValues } from "@/types/travels";
import {
  useCreateTravel,
  useDeleteTravel,
  useUpdateTravel,
} from "../../hooks/travels";
import { useUploadTravelMedia } from "../../hooks/useUploadTravelMedia";
import TravelForm from "../TravelForm";
import { TravelMediaList } from "../TravelMediaList";
import { UploadMedia } from "../UploadMedia";
import styles from "./TravelContent.module.scss";

export default function TravelContent({
  travel = null,
}: {
  travel?: Travel | null;
  isPreview?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { isEditMobile, setIsEditMobile } = useTravelMap();
  const [isEdit, setIsEdit] = useState<boolean>(!travel || isEditMobile);

  const { width } = useWindowSize();
  const isMobile = width > 0 && width < 768;

  const { mutate: updateTravel, isPending: updateIsPending } = useUpdateTravel(
    travel?.id,
  );

  const { mutateAsync: createTravel, isPending: createIsPending } =
    useCreateTravel();

  const { mutateAsync: deleteTravel, isPending: deleteIsPending } =
    useDeleteTravel();

  const {
    upload,
    isPending: uploadIsPending,
    progress: uploadProgress,
  } = useUploadTravelMedia(travel?.id);

  const onSubmit = async (values: TravelFormValues) => {
    if (isEditMobile) {
      setIsEditMobile(false);
    }
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

  const handleCancel = useCallback(() => {
    if (isEditMobile) {
      setIsEditMobile(false);
    }
    if (isMobile) {
      router.push("/travel");
    }
    setIsEdit(false);
  }, [isEditMobile, isMobile, router, setIsEditMobile]);

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
          cancel={handleCancel}
          deleteTravel={travel?.id ? handleDeleteTravel : null}
        />
      )}
      {travel?.id && (
        <UploadMedia
          onSubmit={async (files) => {
            await upload(files);
            toast.success(t("travel.updated"));
          }}
          isPending={uploadIsPending}
          progress={uploadProgress}
        />
      )}
      {travel?.id && (
        <TravelMediaList travelId={travel?.id} clickable={!isEdit} />
      )}
    </div>
  );
}
