"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getCookie } from "@/lib/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type UploadState = {
  progress: number;
  isPending: boolean;
  isSuccess: boolean;
  error: string | null;
};

const initialState: UploadState = {
  progress: 0,
  isPending: false,
  isSuccess: false,
  error: null,
};

export function useUploadTravelMedia(travelId: number | undefined) {
  const [state, setState] = useState<UploadState>(initialState);
  const queryClient = useQueryClient();

  const upload = async (files: File[]): Promise<void> => {
    if (!travelId) throw new Error("Missing travelId");

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      for (const file of files) formData.append("files", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setState((prev) => ({
            ...prev,
            progress: Math.round((event.loaded / event.total) * 100),
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setState({
            progress: 100,
            isPending: false,
            isSuccess: true,
            error: null,
          });
          queryClient.invalidateQueries({ queryKey: ["travel", travelId] });
          queryClient.invalidateQueries({
            queryKey: ["travel", travelId, "medias"],
          });
          resolve();
        } else {
          const error = "Erreur lors de l'upload";
          setState((prev) => ({ ...prev, isPending: false, error }));
          reject(new Error(error));
        }
      };

      xhr.onerror = () => {
        const error = "Erreur réseau";
        setState((prev) => ({ ...prev, isPending: false, error }));
        reject(new Error(error));
      };

      xhr.open("POST", `${API_URL}/api/travel/${travelId}/media`);

      const token = getCookie("accessToken");
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      setState({ progress: 0, isPending: true, isSuccess: false, error: null });
      xhr.send(formData);
    });
  };

  const reset = () => setState(initialState);

  return { upload, reset, ...state };
}
