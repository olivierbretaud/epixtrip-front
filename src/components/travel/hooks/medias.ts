"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { TravelMedia } from "@/types/travels";

export function useGetTravelMedias(travelId: number | undefined) {
  return useQuery({
    queryKey: ["travel", travelId, "medias"],
    queryFn: () =>
      apiClient.get<TravelMedia[]>(`/api/travel/${travelId}/media`, {
        withAuth: true,
      }),
    enabled: !!travelId,
  });
}

export function useDeleteTravelMedia(travelId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: number) =>
      apiClient.delete(`/api/travel/${travelId}/media/${mediaId}`, {
        withAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["travel", travelId, "medias"],
      });
    },
  });
}
