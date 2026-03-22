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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0812 0%, #1a0a2e 100%)",
          borderRadius: 80,
          position: "relative",
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            border: "2px solid rgba(212, 160, 23, 0.25)",
            display: "flex",
          }}
        />
        {/* Inner glow ring */}
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid rgba(212, 160, 23, 0.15)",
            display: "flex",
          }}
        />
        {/* Star symbol */}
        <div
          style={{
            fontSize: 160,
            color: "#d4a017",
            lineHeight: 1,
            marginBottom: 8,
            display: "flex",
            textShadow: "0 0 40px rgba(212, 160, 23, 0.6)",
          }}
        >
          ✦
        </div>
        {/* App name text */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#f5efe6",
            letterSpacing: 2,
            display: "flex",
          }}
        >
          POETRY
        </div>
      </div>
    ),
    { ...size }
  );
}
