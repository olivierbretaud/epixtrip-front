"use client";

import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/shadcn/label";

type InputTextareaProps = {
  label?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
};

export function InputTextarea({
  label,
  registration,
  error,
  placeholder = "",
  disabled,
  rows = 4,
}: InputTextareaProps) {
  const id = registration.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full resize-y rounded-(--radius) border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        {...registration}
      />
      {error?.message && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}
