"use client";

import { Play, Trash2 } from "lucide-react";
import Image from "next/image";
import { Spinner } from "@/components/ui/shadcn/spinner";
import type { TravelMedia } from "@/types/travels";
import { useDeleteTravelMedia, useGetTravelMedias } from "../../hooks/medias";

type MediaGroup = {
  date: string;
  city: string;
  items: TravelMedia[];
};

function groupMedias(medias: TravelMedia[]): MediaGroup[] {
  const map = new Map<string, MediaGroup>();

  for (const media of medias) {
    const date = media.takenAt
      ? new Date(media.takenAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date inconnue";
    const key = `${date}__${media.city ?? ""}`;

    if (!map.has(key)) {
      map.set(key, { date, city: media.city, items: [] });
    }
    map.get(key)?.items.push(media);
  }

  return Array.from(map.values());
}

type MediaItemProps = {
  media: TravelMedia;
  onDelete: (id: number) => void;
  isDeleting: boolean;
};

function MediaItem({ media, onDelete, isDeleting }: MediaItemProps) {
  const isVideo = media.mimeType.startsWith("video/");

  return (
    <div className="group relative w-full overflow-hidden rounded-(--radius) bg-muted">
      {isVideo ? (
        <div className="flex h-40 w-full items-center justify-center bg-black/20">
          <Play className="size-6 text-white" />
        </div>
      ) : (
        <Image
          src={media.url}
          alt={media.description || media.city}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
          placeholder="blur"
          blurDataURL={media.url.replace(
            "/upload/",
            "/upload/w_20,q_1,e_blur:1000/",
          )}
        />
      )}
      <button
        type="button"
        disabled={isDeleting}
        onClick={() => onDelete(media.id)}
        className="absolute top-1 right-1 flex items-center justify-center rounded-full bg-black/60 p-1 transition-opacity md:opacity-0 md:group-hover:opacity-100 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Trash2 className="size-3 text-white" />
        )}
      </button>
    </div>
  );
}

export function TravelMediaList({ travelId }: { travelId: number }) {
  const { data: medias, isLoading } = useGetTravelMedias(travelId);
  const {
    mutate: deleteMedia,
    isPending: isDeleting,
    variables: deletingId,
  } = useDeleteTravelMedia(travelId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!medias?.length) return null;

  const groups = groupMedias(medias);

  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ date, city, items }) => (
        <div key={`${date}__${city}`}>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-sm font-semibold">{city}</span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {items.map((media) => (
              <MediaItem
                key={media.id}
                media={media}
                onDelete={(id) => deleteMedia(id)}
                isDeleting={isDeleting && deletingId === media.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
