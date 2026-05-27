"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Travel, TravelFormValues } from "@/types/travels";

export function useGetTravels() {
  return useQuery({
    queryKey: ["travel"],
    queryFn: () => apiClient.get<Travel[]>("/api/travel", { withAuth: true }),
  });
}

export function useGetTravel(id: string) {
  return useQuery({
    queryKey: ["travel", id],
    queryFn: () =>
      apiClient.get<Travel>(`/api/travel/${id}`, { withAuth: true }),
  });
}

export function useCreateTravel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TravelFormValues) =>
      apiClient.post<Travel>("/api/travel", data, { withAuth: true }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["travel"] });
      queryClient.setQueryData(["travel", created.id], created);
    },
  });
}

export function useDeleteTravel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/api/travel/${id}`, { withAuth: true }),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["travel", id] });
      queryClient.invalidateQueries({ queryKey: ["travel"], exact: true });
    },
  });
}

export function useUpdateTravel(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TravelFormValues) =>
      apiClient.put<Travel>(`/api/travel/${id}`, data, { withAuth: true }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["travel", id], updated);
      queryClient.invalidateQueries({ queryKey: ["travel"] });
    },
  });
}
