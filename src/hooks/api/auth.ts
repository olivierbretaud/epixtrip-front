import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { deleteCookie } from "@/lib/cookies";

// ── Profile ──────────────────────────────────────────────────────────────────

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
};

export function useProfile() {
  return useQuery({
    queryKey: ["userAuth"],
    queryFn: () =>
      apiClient.get<Profile>("/api/auth/profile", { withAuth: true }),
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

type LoginOptions = Omit<
  UseMutationOptions<LoginResponse, Error, LoginPayload>,
  "mutationFn"
>;

export function useLogin(options?: LoginOptions) {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiClient.post<LoginResponse>("/api/auth/login", payload),
    ...options,
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      queryClient.setQueryData(["userAuth"], null);
      deleteCookie("accessToken");
    },
    onSuccess: () => {
      router.push("/");
    },
  });
}

// ── Forgot password ───────────────────────────────────────────────────────────

type ForgotPayload = {
  email: string;
};

type ForgotResponse = {
  message: string;
};

type ForgotOptions = Omit<
  UseMutationOptions<ForgotResponse, Error, ForgotPayload>,
  "mutationFn"
>;

export function useForgot(options?: ForgotOptions) {
  return useMutation({
    mutationFn: (payload: ForgotPayload) =>
      apiClient.post<ForgotResponse>("/api/auth/forgot-password", payload),
    ...options,
  });
}

// ── Reset password ────────────────────────────────────────────────────────────

type ResetPasswordPayload = {
  token: string;
  password: string;
};

type ResetPasswordResponse = {
  message: string;
};

type ResetPasswordOptions = Omit<
  UseMutationOptions<ResetPasswordResponse, Error, ResetPasswordPayload>,
  "mutationFn"
>;

export function useResetPassword(options?: ResetPasswordOptions) {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      apiClient.post<ResetPasswordResponse>(
        "/api/auth/reset-password",
        payload,
      ),
    ...options,
  });
}
