import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resizes an image file to a maximum width and height while maintaining aspect ratio
 * @param file - The original image file
 * @param maxWidth - Maximum width in pixels (default: 1024)
 * @param maxHeight - Maximum height in pixels (default: 1024)
 * @param quality - JPEG quality (0-1, default: 0.8)
 * @returns Promise<File> - The resized image file
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > height) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }

        // Ensure we don't exceed the maximum dimensions
        if (width > maxWidth) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the resized image
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Convert canvas to blob and then to file
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            // If canvas.toBlob fails, return original file
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      // If image loading fails, return original file
      resolve(file);
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}
