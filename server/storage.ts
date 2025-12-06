"use server";

import { put } from "@vercel/blob";
import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";

// Reuse the Redis client configuration
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export interface PhotoResult {
  id: string;
  originalUrl: string;
  generatedUrl: string;
  createdAt: number;
}

// TTL for stored results: 30 days in seconds
const RESULT_TTL = 30 * 24 * 60 * 60;

/**
 * Converts a data URL to a Buffer and extracts the content type
 */
function dataUrlToBuffer(dataUrl: string): {
  buffer: Buffer;
  contentType: string;
} {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid data URL format");
  }
  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");
  return { buffer, contentType };
}

/**
 * Uploads both original and generated images to Vercel Blob storage
 * and stores the metadata in Redis for retrieval
 */
export async function savePhotoResult(
  originalDataUrl: string,
  generatedDataUrl: string
): Promise<PhotoResult> {
  const id = nanoid(10);
  const timestamp = Date.now();

  // Convert data URLs to buffers
  const original = dataUrlToBuffer(originalDataUrl);
  const generated = dataUrlToBuffer(generatedDataUrl);

  // Upload both images to Vercel Blob in parallel
  const [originalBlob, generatedBlob] = await Promise.all([
    put(`christmas/${id}/original`, original.buffer, {
      access: "public",
      contentType: original.contentType,
    }),
    put(`christmas/${id}/generated`, generated.buffer, {
      access: "public",
      contentType: generated.contentType,
    }),
  ]);

  const result: PhotoResult = {
    id,
    originalUrl: originalBlob.url,
    generatedUrl: generatedBlob.url,
    createdAt: timestamp,
  };

  // Store in Redis with TTL
  await redis.set(`photo:${id}`, JSON.stringify(result), {
    ex: RESULT_TTL,
  });

  return result;
}

/**
 * Retrieves photo result metadata from Redis
 */
export async function getPhotoResult(id: string): Promise<PhotoResult | null> {
  const data = await redis.get<string>(`photo:${id}`);
  if (!data) {
    return null;
  }

  // Handle both string and object cases from Redis
  if (typeof data === "string") {
    return JSON.parse(data) as PhotoResult;
  }
  return data as unknown as PhotoResult;
}
