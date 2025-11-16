"use server";

import { generateText } from "ai";

interface ImageInput {
  data: string; // base64 data
  mimeType: string;
}

export async function generateImage(prompt: string, image?: ImageInput) {
  let content;

  if (image) {
    const buffer = Buffer.from(image.data, "base64");
    // Cuando hay una imagen, combinamos el prompt con instrucciones navideñas
    const christmasPrompt = `${prompt}. Transform the person in this image into a Christmas/holiday setting with festive Christmas clothing and decorations. Place them in a cozy Christmas scene with holiday decorations, Christmas lights, and a festive atmosphere. Make sure they are wearing appropriate Christmas attire like Santa hat, Christmas sweater, or other holiday clothing.`;

    content = [
      { type: "text" as const, text: christmasPrompt },
      {
        type: "image" as const,
        image: buffer,
      },
    ];
  } else {
    content = prompt;
  }

  const result = await generateText({
    model: "gemini-2.5-flash-image-preview",
    messages: [
      {
        role: "user" as const,
        content,
      },
    ],
  });

  let imageData = "";

  for (const file of result.files) {
    if (file.mediaType.startsWith("image/")) {
      // Convert to base64 and return as data URL instead of saving to disk
      const base64 = Buffer.from(file.uint8Array).toString("base64");
      imageData = `data:${file.mediaType};base64,${base64}`;
      break; // Solo procesar el primer archivo de imagen
    }
  }

  if (!imageData) {
    throw new Error("No se pudo generar ninguna imagen");
  }

  return imageData;
}
