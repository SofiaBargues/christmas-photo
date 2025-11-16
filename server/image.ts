"use server";

import { generateText } from "ai";
import fs from "node:fs";

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

  let fileName = "";

  for (const file of result.files) {
    if (file.mediaType.startsWith("image/")) {
      const timestamp = Date.now();
      fileName = `generated-${timestamp}.png`;

      await fs.promises.writeFile(`public/${fileName}`, file.uint8Array);
      break; // Solo procesar el primer archivo de imagen
    }
  }

  if (!fileName) {
    throw new Error("No se pudo generar ninguna imagen");
  }

  return `/${fileName}`;
}
