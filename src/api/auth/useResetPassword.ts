import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type ResetPasswordPayload = {
  token: string;
  password: string;
};

type ResetPasswordResponse = {
  message: string;
};

type Options = Omit<
  UseMutationOptions<ResetPasswordResponse, Error, ResetPasswordPayload>,
  "mutationFn"
>;

export function useResetPassword(options?: Options) {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      apiClient.post<ResetPasswordResponse>("/api/auth/reset-password", payload),
    ...options,
  });
}
