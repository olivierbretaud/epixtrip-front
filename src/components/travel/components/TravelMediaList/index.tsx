"use client";

import { Play, Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { cn } from "@/lib/utils";
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
  isActive?: boolean;
  itemRef?: (el: HTMLDivElement | null) => void;
  onClick?: () => void;
};

function MediaItem({
  media,
  onDelete,
  isDeleting,
  isActive,
  itemRef,
  onClick,
}: MediaItemProps) {
  const isVideo = media.mimeType.startsWith("video/");

  return (
    <div
      ref={itemRef}
      className={cn(
        "group relative w-full overflow-hidden rounded-(--radius)",
        isActive && "ring-2",
      )}
    >
      <button type="button" onClick={onClick} className="block w-full">
        {isVideo ? (
          <div className="flex h-40 w-full items-center justify-center bg-black/20">
            <Play className="size-6 text-white" />
          </div>
        ) : (
          <Image
            src={media.url}
            alt={media.description || media.city || `${media.id}`}
            width={0}
            height={0}
            sizes="(max-width: 767px) 100vw, 341px"
            className="h-auto w-full"
            placeholder="blur"
            blurDataURL={media.url.replace(
              "/upload/",
              "/upload/w_20,q_1,e_blur:1000/",
            )}
          />
        )}
      </button>
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
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mediaId = Number(searchParams.get("mediaId")) || null;

  const handleMediaClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mediaId", String(id));
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!mediaId) return;
    itemRefs.current
      .get(mediaId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [mediaId]);

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
                isActive={media.id === mediaId}
                onClick={() => handleMediaClick(media.id)}
                itemRef={(el) => {
                  if (el) itemRefs.current.set(media.id, el);
                  else itemRefs.current.delete(media.id);
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
