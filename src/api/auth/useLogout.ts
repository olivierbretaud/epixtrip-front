import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/lib/cookies";

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
