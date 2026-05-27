"use client";

import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";

type InputEmailProps = {
  label?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function InputEmail({
  label = "Email",
  registration,
  error,
  placeholder = "exemple@mail.com",
  disabled,
  autoComplete = "email",
}: InputEmailProps) {
  const id = registration.name;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        {...registration}
      />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
