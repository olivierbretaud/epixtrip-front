"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { InputEmail } from "@/components/ui/inputs/InputEmail";
import { InputPassword } from "@/components/ui/inputs/InputPassword";
import { Button } from "@/components/ui/shadcn/button/index";
import { useLogin } from "@/hooks/api/auth";
import { setCookie } from "@/lib/cookies";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const {
    mutate: login,
    isPending,
    error,
  } = useLogin({
    onSuccess: (res) => {
      setCookie("accessToken", res.accessToken);
      router.push("/trips");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
      noValidate
    >
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

      {error?.message === "Invalid credentials" && (
        <p className="text-sm text-destructive">{t("auth.login.invalid")}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        size="md"
        className="mt-2 w-full"
      >
        {isPending ? t("auth.login.loading") : t("auth.login.submit")}
      </Button>
      <Link
        href="/forgot"
        className="text-sm text-center underline underline-offset-4"
      >
        {t("auth.login.forgot")}
      </Link>
    </form>
  );
}
