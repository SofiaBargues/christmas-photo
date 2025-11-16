import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Verificar que es una imagen
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Verificar tamaño después de la compresión (máximo 3MB)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB. Please try a smaller image.` 
      }, { status: 400 });
    }

    console.log(`Processing image: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    // Convertir a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      data: base64,
      mimeType: file.type,
      size: file.size,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
