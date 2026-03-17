import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type ForgotPayload = {
  email: string;
};

type ForgotResponse = {
  message: string;
};

type Options = Omit<
  UseMutationOptions<ForgotResponse, Error, ForgotPayload>,
  "mutationFn"
>;

export function useForgot(options?: Options) {
  return useMutation({
    mutationFn: (payload: ForgotPayload) =>
      apiClient.post<ForgotResponse>("/api/auth/forgot-password", payload),
    ...options,
  });
}
