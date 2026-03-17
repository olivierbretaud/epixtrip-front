import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

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
