import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPhotoResult } from "@/server/storage";
import { ShareableResult } from "@/components/shareable-result";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPhotoResult(id);
  
  if (!result) {
    return {
      title: "Photo Not Found",
    };
  }

  return {
    title: "My Christmas Photo - AI Photo Editor",
    description: "Check out my festive Christmas photo transformation!",
    openGraph: {
      title: "My Christmas Photo Transformation",
      description: "Transform your photos with festive Christmas magic using AI!",
      images: [
        {
          url: result.generatedUrl,
          width: 1200,
          height: 630,
          alt: "Christmas Photo Transformation",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "My Christmas Photo Transformation",
      description: "Transform your photos with festive Christmas magic using AI!",
      images: [result.generatedUrl],
    },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPhotoResult(id);

  if (!result) {
    notFound();
  }

  return <ShareableResult result={result} />;
}
