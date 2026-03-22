import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0812 0%, #1a0a2e 100%)",
          borderRadius: 96,
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "2px solid rgba(212,160,23,0.3)",
            display: "flex",
          }}
        />
        {/* SVG 4-pointed star / diamond shape */}
        <svg
          width="220"
          height="220"
          viewBox="0 0 100 100"
          style={{ position: "absolute" }}
        >
          {/* 4-pointed star made from two rotated diamonds */}
          <polygon
            points="50,5 58,42 95,50 58,58 50,95 42,58 5,50 42,42"
            fill="#d4a017"
            opacity="0.9"
          />
        </svg>
        {/* Center dot */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#0a0812",
            position: "absolute",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
