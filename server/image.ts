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
    const christmasPrompt = `${prompt}. Transform the person(s) in this image into a warm Christmas/holiday scene while preserving all faces exactly as in the original (no changes to facial features, expressions, or identity) and keeping their original poses. Add warm, ambient Christmas lighting (soft, 2700–3200K) without altering facial shapes. 

**Important for background**: If the background is visible and defined, DO NOT replace it. Instead, decorate the existing environment by naturally integrating Christmas elements such as garlands on walls, hanging Christmas lights, ornaments on visible surfaces, stockings on fireplaces (if present), candles, or small festive decorations that complement the original space. Only if the background is unclear, blurred, or undefined, then replace it with an appropriate Christmas scene.

Dress the people in festive Christmas attire (Santa hat, Christmas sweater, plaid scarf, red/green holiday clothing) ensuring the outfits appear natural. Maintain original composition and proportions; avoid altering facial structure. The final result should show the original space enhanced with Christmas decorations rather than completely transformed.
Eyes preservation**: The eyes must remain EXACTLY identical to the original photo.`;

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
