import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0812 0%, #1a0a2e 100%)",
          borderRadius: 36,
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: "1.5px solid rgba(212,160,23,0.3)",
            display: "flex",
          }}
        />
        {/* 4-pointed star */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          style={{ position: "absolute" }}
        >
          <polygon
            points="50,5 58,42 95,50 58,58 50,95 42,58 5,50 42,42"
            fill="#d4a017"
            opacity="0.9"
          />
        </svg>
        {/* Center dot */}
        <div
          style={{
            width: 8,
            height: 8,
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
