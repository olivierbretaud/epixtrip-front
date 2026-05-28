import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const compressed = await sharp(buffer)
    .resize({
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .withMetadata() // ← préserve tous les EXIF dont GPS
    .toBuffer();

  return new NextResponse(new Uint8Array(compressed), {
    headers: { "Content-Type": "image/jpeg" },
  });
}
