import { ImageResponse } from "next/og";
import { getPhotoResult } from "@/server/storage";

export const runtime = "edge";

export const alt = "Christmas Transformation Result";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPhotoResult(id);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#1a0505",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F5E6D3",
            fontSize: "40px",
            fontFamily: "sans-serif",
          }}
        >
          Photo not found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#1a0505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 40,
            display: "flex",
            color: "#D4AF37",
            fontSize: 32,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Christmas Transformation
        </div>

        {/* Images Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          {/* Before Image */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "400px",
                height: "400px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "4px solid #3a2525",
                background: "#000",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.originalUrl}
                width="400"
                height="400"
                style={{ objectFit: "cover" }}
                alt="Original"
              />
            </div>
            <div
              style={{
                marginTop: "15px",
                color: "#F5E6D3",
                fontSize: "24px",
                opacity: 0.8,
              }}
            >
              Before
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{ color: "#D4AF37", fontSize: "40px", marginTop: "-40px" }}
          >
            →
          </div>

          {/* After Image */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "400px",
                height: "400px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "4px solid #D4AF37",
                background: "#000",
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.generatedUrl}
                width="400"
                height="400"
                style={{ objectFit: "cover" }}
                alt="Generated"
              />
            </div>
            <div
              style={{
                marginTop: "15px",
                color: "#D4AF37",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              After
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            color: "#F5E6D3",
            fontSize: 20,
            opacity: 0.6,
          }}
        >
          Christmas AI Photo Editor
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
