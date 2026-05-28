import imageCompression from "browser-image-compression";
import piexif from "piexifjs";

export async function compressImage(
  file: File,
  { maxWidthOrHeight = 1920, quality = 0.8 } = {},
): Promise<File> {
  // 2. Compresser (browser-image-compression préserve mieux que Canvas)
  const compressed = await imageCompression(file, {
    maxWidthOrHeight,
    initialQuality: quality,
    useWebWorker: true,
    preserveExif: true,
    fileType: "image/jpeg",
  });

  // 3. Réinjecter les EXIF si on en avait
  return compressed;
}

export async function hasGpsData(file: File): Promise<boolean> {
  if (!file.type.startsWith("image/")) return false;
  try {
    const dataUrl = await fileToDataUrl(file);
    const exifObj = piexif.load(dataUrl);
    return Object.keys(exifObj.GPS ?? {}).length > 0;
  } catch {
    return false;
  }
}

// async function extractExif(file: File): Promise<string | null> {
//   try {
//     const dataUrl = await fileToDataUrl(file);
//     const exifObj = piexif.load(dataUrl);
//     return piexif.dump(exifObj);
//   } catch {
//     return null; // pas d'EXIF dans ce fichier
//   }
// }

// async function injectExif(file: File, exifData: string): Promise<File> {
//   const dataUrl = await fileToDataUrl(file);
//   const injected = piexif.insert(exifData, dataUrl);

//   const blob = dataUrlToBlob(injected);
//   return new File([blob], file.name, { type: "image/jpeg" });
// }

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// function dataUrlToBlob(dataUrl: string): Blob {
//   const [header, data] = dataUrl.split(",");
//   const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
//   const binary = atob(data);
//   const array = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
//   return new Blob([array], { type: mime });
// }
