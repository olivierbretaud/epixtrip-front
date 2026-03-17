"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";

type InputPasswordProps = {
  label?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function InputPassword({
  label = "Mot de passe",
  registration,
  error,
  placeholder = "••••••••",
  disabled,
  autoComplete = "current-password",
}: InputPasswordProps) {
  const [visible, setVisible] = useState(false);
  const id = registration.name;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className="pr-10"
          {...registration}
        />
        <button
          type="button"
          aria-label={
            visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:pointer-events-none"
        >
          {visible ? (
            <EyeOff size={16} aria-hidden="true" />
          ) : (
            <Eye size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
