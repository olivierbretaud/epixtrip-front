"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTravelMap } from "@/components/layouts/app/TravelMapContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Travel } from "@/types/travels";
import { useGetTravelMedias } from "../../hooks/medias";

type TravelMobileProps = {
  travel: Travel;
};

export function TravelMobile({ travel }: TravelMobileProps) {
  const { setIsEditMobile } = useTravelMap();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleMediaClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mediaId", String(id));
    router.push(`${pathname}?${params.toString()}`);
  };
  const { data: medias = [] } = useGetTravelMedias(travel.id);
  const [activeMediaId, setActiveMediaId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const mediaIds = useMemo(() => medias.map((m) => m.id), [medias]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || mediaIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.left - b.boundingClientRect.left,
          );
        if (visible.length > 0) {
          const id = Number((visible[0].target as HTMLElement).dataset.id);
          setActiveMediaId(id);
        }
      },
      { root: container, threshold: 1 },
    );

    for (const el of itemRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [mediaIds]);

  const lastActiveMediaRef = useRef<(typeof medias)[number] | undefined>(
    undefined,
  );
  const activeMedia = useMemo(() => {
    const found = medias.find((m) => m.id === activeMediaId);
    if (found) lastActiveMediaRef.current = found;
    return lastActiveMediaRef.current;
  }, [medias, activeMediaId]);

  const mediaId = Number(searchParams.get("mediaId")) || null;

  useEffect(() => {
    if (!mediaId || medias.length === 0) return;
    const media = medias.find((m) => m.id === mediaId);
    if (!media) return;
    lastActiveMediaRef.current = media;
    setActiveMediaId(mediaId);
    itemRefs.current.get(mediaId)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [mediaId, medias]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 pb-4"
      style={{
        background:
          "linear-gradient(to bottom, transparent, var(--background) 40%)",
      }}
    >
      <div className="flex items-end justify-between px-4 py-3">
        <div className="flex flex-col truncate">
          {activeMedia && (
            <>
              {(activeMedia.city || activeMedia.place) && (
                <span className="font-bold text-xl truncate">
                  {[activeMedia.city, activeMedia.place]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
              {activeMedia.takenAt && (
                <span className="text-xs text-muted-foreground truncate">
                  {new Date(activeMedia.takenAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" - "}
                  {travel.title}
                </span>
              )}
            </>
          )}
        </div>
        <Button size="sm" onClick={() => setIsEditMobile(true)}>
          Éditer
        </Button>
      </div>

      {medias.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-2 px-4 pb-1 scrollbar-none"
        >
          {medias.map((media) => (
            <button
              type="button"
              key={media.id}
              ref={(el) => {
                if (el) itemRefs.current.set(media.id, el);
                else itemRefs.current.delete(media.id);
              }}
              data-id={media.id}
              onClick={() => handleMediaClick(media.id)}
              className={cn(
                "flex-none rounded-(--radius) overflow-hidden bg-muted opacity-30",
                media.id === activeMediaId && "ring-2 opacity-100",
              )}
            >
              {media.mimeType.startsWith("image/") ? (
                <Image
                  src={media.url}
                  alt={media.city ?? media.place ?? ""}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto object-cover"
                  style={{ height: "18vh" }}
                  placeholder="blur"
                  blurDataURL={media.url.replace(
                    "/upload/",
                    "/upload/w_20,q_1,e_blur:1000/",
                  )}
                />
              ) : (
                <div
                  className="flex items-center justify-center bg-black/20 text-xs text-white"
                  style={{ height: "20vh", width: "12vh" }}
                >
                  ▶
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
