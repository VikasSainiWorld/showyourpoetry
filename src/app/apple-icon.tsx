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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0812 0%, #1a0a2e 100%)",
          borderRadius: 36,
        }}
      >
        {/* Star symbol */}
        <div
          style={{
            fontSize: 80,
            color: "#d4a017",
            lineHeight: 1,
            marginBottom: 4,
            display: "flex",
          }}
        >
          ✦
        </div>
        {/* App name text */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#f5efe6",
            letterSpacing: 1,
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
