import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Christmas AI Photo Editor";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const beforeBuffer = await readFile(
    join(process.cwd(), "public/demo-before.png")
  );
  const afterBuffer = await readFile(
    join(process.cwd(), "public/demo-after.png")
  );

  const beforeSrc = `data:image/png;base64,${beforeBuffer.toString("base64")}`;
  const afterSrc = `data:image/png;base64,${afterBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(180deg, #1a0505 0%, #2d1010 50%, #1a0505 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative particles */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "80px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#D4AF37",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "120px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#D4AF37",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "150px",
            left: "150px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#D4AF37",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            right: "200px",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#D4AF37",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "50px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "300px",
            right: "60px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.15,
          }}
        />

        {/* Header Title */}
        <div
          style={{
            display: "flex",
            marginTop: "45px",
            color: "#D4AF37",
            fontSize: 42,
            fontWeight: "bold",
            fontStyle: "italic",
            letterSpacing: "3px",
          }}
        >
          CHRISTMAS AI PHOTO EDITOR
        </div>

        {/* Images Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "50px",
            marginTop: "30px",
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
                width: "320px",
                height: "320px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "4px solid #3a2525",
                background: "#000",
              }}
            >
              <img
                src={beforeSrc}
                width="320"
                height="320"
                style={{ objectFit: "cover" }}
                alt="Original"
              />
            </div>
            <div
              style={{
                marginTop: "12px",
                color: "#F5E6D3",
                fontSize: "22px",
                opacity: 0.8,
              }}
            >
              Before
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              color: "#D4AF37",
              fontSize: "48px",
              marginTop: "-30px",
            }}
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
                width: "320px",
                height: "320px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "4px solid #D4AF37",
                background: "#000",
                boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)",
              }}
            >
              <img
                src={afterSrc}
                width="320"
                height="320"
                style={{ objectFit: "cover" }}
                alt="Generated"
              />
            </div>
            <div
              style={{
                marginTop: "12px",
                color: "#D4AF37",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              After
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "25px",
          }}
        >
          <div
            style={{
              color: "#F5E6D3",
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Transform any photo into a festive masterpiece
          </div>
          <div
            style={{
              color: "#D4AF37",
              fontSize: 20,
              opacity: 0.9,
            }}
          >
            Add Christmas decorations and costumes instantly with AI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
