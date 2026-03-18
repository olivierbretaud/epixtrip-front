"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { InputPassword } from "@/components/ui/inputs/InputPassword";
import { Button } from "@/components/ui/shadcn/button/index";
import { useResetPassword } from "@/hooks/api/auth";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const t = useTranslations();
  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    error,
  } = useResetPassword();
  const token = useSearchParams().get("token") ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>();

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({ token, password: data.password });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
      noValidate
    >
      <h2 className="text-center text-lg">{t("auth.resetPassword.title")}</h2>

      <InputPassword
        label={t("label.password")}
        registration={register("password", {
          required: t("auth.login.password.required"),
          minLength: { value: 8, message: t("auth.login.password.minLength") },
          validate: {
            uppercase: (v) =>
              /[A-Z]/.test(v) || t("auth.login.password.uppercase"),
            lowercase: (v) =>
              /[a-z]/.test(v) || t("auth.login.password.lowercase"),
            number: (v) => /[0-9]/.test(v) || t("auth.login.password.number"),
            special: (v) =>
              /[^A-Za-z0-9]/.test(v) || t("auth.login.password.special"),
          },
        })}
        error={errors.password}
      />

      <InputPassword
        label={t("auth.resetPassword.confirmPassword")}
        registration={register("confirmPassword", {
          required: t("auth.login.password.required"),
          validate: (v) =>
            v === watch("password") || t("auth.resetPassword.passwordMismatch"),
        })}
        error={errors.confirmPassword}
      />

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      {isSuccess && (
        <p className="text-sm font-semibold text-primary text-center">
          {t("auth.resetPassword.success")}
        </p>
      )}

      {!isSuccess && (
        <Button
          type="submit"
          disabled={isPending}
          size="md"
          className="mt-2 w-full"
        >
          {isPending
            ? t("auth.resetPassword.loading")
            : t("auth.resetPassword.submit")}
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
