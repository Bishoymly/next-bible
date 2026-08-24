import { ImageResponse } from "next/og";

export const alt = "The Gospel of Jesus Christ - Bible";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "76px 84px",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f6f3ec",
        color: "#1c1b18",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          fontSize: 25,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ width: 42, height: 2, background: "#9c7850" }} />
        Bible
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div
          style={{
            maxWidth: 960,
            fontFamily: "Georgia, serif",
            fontSize: 82,
            lineHeight: 1.03,
            letterSpacing: "-0.045em",
          }}
        >
          The Gospel of Jesus Christ
        </div>
        <div
          style={{
            maxWidth: 890,
            color: "#625f58",
            fontSize: 27,
            lineHeight: 1.4,
          }}
        >
          A Scripture-grounded guide to sin, grace, faith, repentance, and hope
          in Christ.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#625f58",
          fontSize: 22,
        }}
      >
        <span>bible.bishoy.io/gospel</span>
        <span>John 3:16</span>
      </div>
    </div>,
    size,
  );
}
