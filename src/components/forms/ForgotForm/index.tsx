"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useForgot } from "@/api/auth/useForgot";
import { InputEmail } from "@/components/ui/inputs/InputEmail";
import { Button } from "@/components/ui/shadcn/button/index";

type ForgotFormValues = {
  email: string;
};

export default function ForgotForm() {
  const t = useTranslations();
  const { mutate: forgot, isPending, isSuccess, error } = useForgot();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>();

  const onSubmit = (data: ForgotFormValues) => {
    forgot(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
      noValidate
    >
      <h2 className="text-center text-lg">{t("auth.forgot.title")}</h2>
      <InputEmail
        label={t("label.email")}
        registration={register("email", {
          required: t("auth.login.email.required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("auth.login.email.invalid"),
          },
        })}
        error={errors.email}
      />

      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}

      {isSuccess && (
        <p className="text-sm font-semibold text-primary text-center">
          {t("auth.forgot.success")}
        </p>
      )}

      {!isSuccess && (
        <Button
          type="submit"
          disabled={isPending}
          size="md"
          className="mt-2 w-full"
        >
          {isPending ? t("auth.forgot.loading") : t("auth.forgot.submit")}
        </Button>
      )}
      <Link
        href="/"
        className="text-sm text-center underline underline-offset-4"
      >
        {t("auth.forgot.back")}
      </Link>
    </form>
  );
}
