"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button/index";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { InputText } from "@/components/ui/inputs/InputText";
import { InputTextarea } from "@/components/ui/inputs/InputTextarea";
import type { TravelFormValues } from "@/types/travels";

export default function TravelForm({
  onSubmit,
  isPending = false,
  defaultValues = {},
  deleteTravel = null,
  cancel,
}: {
  onSubmit: (values: TravelFormValues) => void;
  isPending: boolean;
  cancel: () => void;
  deleteTravel?: (() => void) | null | undefined;
  defaultValues: Partial<TravelFormValues>;
}) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TravelFormValues>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
      noValidate
    >
      <InputText
        label={t("travel.form.title")}
        registration={register("title", {
          required: t("form.required"),
        })}
        error={errors.title}
      />
      <InputTextarea
        label={t("travel.form.description")}
        registration={register("description", { required: t("form.required") })}
        error={errors.description}
        rows={6}
      />
      <div className="flex justify-between">
        <div>
          {deleteTravel && (
            <CustomDialog
              trigger={
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                >
                  {t("btn.delete")}
                </Button>
              }
              title={t("travel.confirmDelete")}
              description={t("travel.confirmDeleteDescription")}
              actionLabel={t("btn.delete")}
              cancelLabel={t("btn.cancel")}
              onAction={deleteTravel}
            />
          )}
        </div>
        <div>
          <Button
            onClick={cancel}
            className="mr-4"
            variant={"secondary"}
            disabled={isPending}
          >
            {t("btn.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {t("btn.save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
