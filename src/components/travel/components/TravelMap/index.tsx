"use client";

import type { Map as MapLibre, Marker as MapLibreMarker } from "maplibre-gl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTravelMap } from "@/components/layouts/app/TravelMapContext";
import type { TravelMedia } from "@/types/travels";
import { useGetTravelMedias } from "../../hooks/medias";

type TravelMapProps = {
  travelId: number | undefined;
};

export function TravelMap({ travelId }: TravelMapProps) {
  const { data: medias = [] } = useGetTravelMedias(travelId);
  const { isEditMobile } = useTravelMap();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mediaId = Number(searchParams.get("mediaId")) || null;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibre | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const updateMarkersRef = useRef<(map: MapLibre) => void>(() => {});

  const navigateToMediaRef = useRef((id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mediaId", String(id));
    router.push(`${pathname}?${params.toString()}`);
  });
  useEffect(() => {
    navigateToMediaRef.current = (id: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("mediaId", String(id));
      router.push(`${pathname}?${params.toString()}`);
    };
  }, [router, pathname, searchParams]);

  const geoMedias = useMemo(
    () => medias.filter((m) => m.lat && m.lng),
    [medias],
  );

  const fitBounds = useCallback((map: MapLibre, items: TravelMedia[]) => {
    import("maplibre-gl").then(({ LngLatBounds }) => {
      const bounds = new LngLatBounds();
      for (const m of items) bounds.extend([m.lng, m.lat]);
      const isMobile = window.innerWidth < 768;
      map.fitBounds(bounds, {
        ...(isMobile
          ? {
              padding: {
                top: 80,
                left: 60,
                right: 60,
                bottom: 180,
              },
            }
          : {
              padding: {
                top: 120,
                left: 120,
                right: 120,
                bottom: 120,
              },
            }),
        maxZoom: 14,
        duration: 800,
      });
    });
  }, []);

  const updateMarkers = useCallback(
    (map: MapLibre) => {
      import("maplibre-gl").then(({ Marker: MarkerGL }) => {
        for (const marker of markersRef.current) marker.remove();
        markersRef.current = [];

        for (const media of geoMedias) {
          const el = document.createElement("div");
          el.className = "travel-map-marker";
          el.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: var(--primary);
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            overflow: hidden;
          `;

          if (media.mimeType.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = media.url.replace(
              "/upload/",
              "/upload/w_80,h_80,c_fill/",
            );
            img.alt = media.city ?? media.place ?? "";
            img.style.cssText = "width:100%;height:100%;object-fit:cover;";
            el.appendChild(img);
          }

          el.addEventListener("click", () =>
            navigateToMediaRef.current(media.id),
          );

          const marker = new MarkerGL({ element: el })
            .setLngLat([media.lng, media.lat])
            .addTo(map);

          markersRef.current.push(marker);
        }

        if (map.getLayer("travel-path")) map.removeLayer("travel-path");
        if (map.getSource("travel-path")) map.removeSource("travel-path");

        const sorted = [...geoMedias].sort((a, b) => {
          if (!a.takenAt || !b.takenAt) return 0;
          return new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime();
        });

        if (sorted.length >= 2) {
          map.addSource("travel-path", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: sorted.map((m) => [m.lng, m.lat]),
              },
              properties: {},
            },
          });
          map.addLayer({
            id: "travel-path",
            type: "line",
            source: "travel-path",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#ffffff",
              "line-width": 2,
              "line-opacity": 0.5,
            },
          });
        }

        if (geoMedias.length > 0) {
          fitBounds(map, geoMedias);
        }
      });
    },
    [geoMedias, fitBounds],
  );

  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return () => {};

    let map: MapLibre;

    import("maplibre-gl").then(({ Map: MapGL, NavigationControl }) => {
      if (!containerRef.current) return;
      map = new MapGL({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            satellite: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              attribution: "© Esri",
            },
          },
          layers: [{ id: "satellite", type: "raster", source: "satellite" }],
        },
        center: [2.3488, 48.8534],
        zoom: 3,
      });

      map.addControl(new NavigationControl(), "bottom-left");
      mapRef.current = map;

      map.on("load", () => updateMarkersRef.current(map));
    });

    return () => {
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    return initMap();
  }, [initMap]);

  useEffect(() => {
    updateMarkersRef.current = updateMarkers;
    if (!mapRef.current) return;
    updateMarkersRef.current(mapRef.current);
  }, [updateMarkers]);

  useEffect(() => {
    if (!mediaId || !mapRef?.current) return;
    const media = geoMedias.find((m) => m.id === mediaId);
    if (!media) return;
    const isMobile = window.innerWidth < 768;
    mapRef.current.flyTo({
      center: [media.lng, media.lat],
      zoom: 14,
      duration: 800,
      ...(isMobile
        ? {
            padding: {
              top: 80,
              left: 60,
              right: 60,
              bottom: 180,
            },
          }
        : {
            padding: {
              top: 120,
              left: 120,
              right: 120,
              bottom: 120,
            },
          }),
    });
  }, [mediaId, geoMedias]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full md:w-[calc(100%-400px)]"
      style={{ height: "100dvh" }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
