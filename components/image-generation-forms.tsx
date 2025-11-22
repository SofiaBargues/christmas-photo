"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateImage } from "@/server/image";
import { useState, useRef } from "react";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

interface UploadedImage {
  data: string;
  mimeType: string;
  name: string;
  preview: string;
}

export function ImageGenerationForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // Función para comprimir imagen
  const compressImage = (
    file: File,
    maxWidth = 1024,
    quality = 0.8
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = document.createElement("img");

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Limpiar URL después del uso
        URL.revokeObjectURL(img.src);

        // Convertir a blob con compresión
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          file.type.includes("png") ? "image/jpeg" : file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Comprimir imagen si es muy grande
      let processedFile: File | Blob = file;
      if (file.size > 500 * 1024) {
        // Si es mayor a 500KB
        console.log(
          `Comprimiendo imagen de ${(file.size / 1024 / 1024).toFixed(2)}MB`
        );
        processedFile = await compressImage(file);
        console.log(
          `Imagen comprimida a ${(processedFile.size / 1024 / 1024).toFixed(
            2
          )}MB`
        );
      }

      const formData = new FormData();
      formData.append("image", processedFile, file.name);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      const preview = URL.createObjectURL(file);

      setUploadedImage({
        data: result.data,
        mimeType: result.mimeType,
        name: result.name,
        preview,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  }

  function removeImage() {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const imageInput = uploadedImage
        ? {
            data: uploadedImage.data,
            mimeType: uploadedImage.mimeType,
          }
        : undefined;

      const imageUrl = await generateImage(values.prompt, imageInput);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your image" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the image you want to generate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de imagen opcional */}
          <FormItem>
            <FormLabel>Reference Image (Optional)</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing and optimizing image...
                  </div>
                )}
                {uploadedImage && (
                  <div className="relative inline-block">
                    <Image
                      src={uploadedImage.preview}
                      alt={uploadedImage.name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Upload a photo of a person to automatically place them in a
              Christmas/holiday setting with festive clothing and decorations.
              Large images will be automatically compressed for optimal
              processing.
            </FormDescription>
          </FormItem>

          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Image"
            )}
          </Button>
        </form>
      </Form>
      {imageUrl && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Image:</h3>
          <Image
            src={imageUrl}
            alt="Generated"
            height={1000}
            width={1000}
            className="rounded-lg"
          />
        </div>
      )}
    </>
  );
}
