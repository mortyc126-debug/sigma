import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1c1917 0%, #0c0a09 100%)",
          borderRadius: "8px",
          border: "1px solid rgba(251, 191, 36, 0.25)",
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(253, 224, 71, 0.95)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Σ
      </div>
    ),
    { ...size }
  );
}
