"use server";
const MOCK = false;
//

import { gateway, generateText } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { checkRateLimit, RateLimitInfo } from "./ratelimit";
import { savePhotoResult, PhotoResult } from "./storage";
import { systemPrompt } from "./system-prompt";

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
  userPrompt: string,
  image: ImageInput
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

  const buffer = Buffer.from(image.data, "base64");
  // Cuando hay una imagen, combinamos el prompt con instrucciones navideñas
  const christmasPrompt = await systemPrompt(userPrompt);

  const content = [
    { type: "text" as const, text: christmasPrompt },
    {
      type: "image" as const,
      image: buffer,
    },
  ];

  const model = gateway("google/gemini-3-pro-image");

  const result = await generateText({
    model: model,
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
  const originalDataUrl = `data:${image?.mimeType || "image/jpeg"};base64,${
    image?.data || ""
  }`;
  const photoResult = await savePhotoResult(originalDataUrl, imageData);

  return {
    imageData,
    rateLimitInfo,
    photoResult,
  };
}
