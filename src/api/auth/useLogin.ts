import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

type Options = Omit<
  UseMutationOptions<LoginResponse, Error, LoginPayload>,
  "mutationFn"
>;

export function useLogin(options?: Options) {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiClient.post<LoginResponse>("/api/auth/login", payload),
    ...options,
  });
}
