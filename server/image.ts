"use server";
const MOCK = false;
//

import { generateText } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { checkRateLimit, RateLimitInfo } from "./ratelimit";
import { savePhotoResult, PhotoResult } from "./storage";

interface ImageInput {
  data: string; // base64 data
  mimeType: string;
}

export interface GenerateImageResult {
  imageData: string | null;
  rateLimitInfo: RateLimitInfo;
  error?: string;
  photoResult?: PhotoResult; // Result with shareable URLs
}

const googleProviderOptions: GoogleGenerativeAIProviderOptions = {
  imageConfig: {
    imageSize: "2K",
  },
};

export async function generateImage(
  prompt: string,
  image?: ImageInput
): Promise<GenerateImageResult> {
  // Check rate limit first
  const rateLimitInfo = await checkRateLimit();

  if (MOCK) {
    // Simulate delay and return the same image
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (image && image.data) {
      // Return the original image data
      const imageData = `data:${image.mimeType};base64,${image.data}`;
      const originalDataUrl = imageData;
      const photoResult = await savePhotoResult(originalDataUrl, imageData);
      return {
        imageData,
        rateLimitInfo,
        photoResult,
      };
    } else {
      return {
        imageData: null,
        rateLimitInfo,
        error: "No image provided in mock mode",
      };
    }
  }

  if (!rateLimitInfo.success) {
    return {
      imageData: null,
      rateLimitInfo,
      error: "Rate limit exceeded. Please try again tomorrow.",
    };
  }

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
    model: "google/gemini-3-pro-image",
    messages: [
      {
        role: "user" as const,
        content,
      },
    ],
    providerOptions: {
      google: googleProviderOptions,
    },
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
    return {
      imageData: null,
      rateLimitInfo,
      error: "No se pudo generar ninguna imagen",
    };
  }

  // Save both original and generated images to storage
  const originalDataUrl = `data:${image?.mimeType || "image/jpeg"};base64,${image?.data || ""}`;
  const photoResult = await savePhotoResult(originalDataUrl, imageData);

  return {
    imageData,
    rateLimitInfo,
    photoResult,
  };
}
