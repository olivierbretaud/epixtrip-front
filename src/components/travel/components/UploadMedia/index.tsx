"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { compressImage, hasGpsData } from "@/lib/compressImage";
import { cn } from "@/lib/utils";

type MediaFile = {
  id: string;
  file: File;
  previewUrl: string;
};

type UploadMediaProps = {
  onSubmit: (files: File[]) => Promise<void>;
  isPending?: boolean;
  progress?: number;
  label?: string;
  submitLabel?: string;
};

export function UploadMedia({
  onSubmit,
  isPending = false,
  progress = 0,
  label = "Ajouter des médias",
  submitLabel = "Envoyer",
}: UploadMediaProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [exifErrors, setExifErrors] = useState<number[]>([]);
  const inputId = "upload-media-input";

  const totalSizeMb = useMemo(
    () => files.reduce((sum, { file }) => sum + file.size, 0) / (1024 * 1024),
    [files],
  );

  const isMaxSize = totalSizeMb > 4.5;
  const isGpsError = exifErrors?.length > 0;

  const revokeAll = useCallback(() => {
    for (const f of files) URL.revokeObjectURL(f.previewUrl);
  }, [files]);

  useEffect(() => {
    return revokeAll;
  }, [revokeAll]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Array.from(e.target.files ?? []);
    e.target.value = "";

    const newFiles = await Promise.all(
      raw.map(async (file) => {
        const compressed = file.type.startsWith("image/")
          ? await compressImage(file)
          : file;
        return {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file: compressed,
          previewUrl: URL.createObjectURL(compressed),
        };
      }),
    );

    const gpsResults = await Promise.all(
      newFiles.map(({ file }) => hasGpsData(file)),
    );

    setFiles((prev) => {
      const offset = prev.length;
      const missing = gpsResults
        .map((hasGps, i) =>
          !hasGps && raw[i].type.startsWith("image/") ? offset + i : -1,
        )
        .filter((i) => i !== -1);
      setExifErrors((prev) => [...(prev ?? []), ...missing]);
      return [...prev, ...newFiles];
    });
  };

  const removeFile = (id: string) => {
    setError(null);
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx !== -1) {
        URL.revokeObjectURL(prev[idx].previewUrl);
        setExifErrors((errs) =>
          (errs ?? [])
            .filter((e) => e !== idx)
            .map((e) => (e > idx ? e - 1 : e)),
        );
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearFiles = () => {
    for (const f of files) URL.revokeObjectURL(f.previewUrl);
    setError(null);
    setFiles([]);
    setExifErrors([]);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      await onSubmit(files.map((f) => f.file));
      clearFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <input
        id={inputId}
        type="file"
        accept="image/jpeg"
        multiple
        className="sr-only"
        onChange={handleChange}
        disabled={isPending}
      />

      <label
        htmlFor={inputId}
        className={cn(
          buttonVariants({ variant: "outline", size: "md" }),
          "cursor-pointer mt-6",
          isPending && "pointer-events-none opacity-50",
        )}
      >
        <Plus />
        {label}
      </label>

      {files.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">
            {files.length} fichier{files.length > 1 ? "s" : ""} —{" "}
            {totalSizeMb?.toFixed(1)} Mo
          </p>
          <div className="grid grid-cols-3 gap-2">
            {files.map(({ id, file, previewUrl }, index) => (
              <div
                key={id}
                className={cn(
                  "group relative h-24 w-full overflow-hidden rounded-(--radius)",
                  exifErrors?.includes(index) && "ring-2 ring-destructive",
                )}
              >
                {file.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    className="h-full w-full object-cover"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(id)}
                  className="absolute top-1 right-1 flex items-center justify-center rounded-full bg-black/60 p-1 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 className="size-3 text-white" />
                </button>
              </div>
            ))}
          </div>
          {isMaxSize && (
            <p className="text-xs text-destructive">
              Le poids maximal des fichiers est atteint
            </p>
          )}
          {isGpsError && (
            <p className="text-xs text-destructive">
              Certains fichiers n'ont pas de données GPS
            </p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          {isPending && (
            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-card">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs mt-2 flex justify-between">
                {progress === 100 ? "Finalisation…" : "Envoi en cours…"}
                <span>{progress}%</span>
              </div>
            </div>
          )}
          {!isPending && (
            <Button
              onClick={handleSubmit}
              size={"md"}
              disabled={isPending || isMaxSize || isGpsError}
            >
              {submitLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
