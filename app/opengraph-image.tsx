import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Share card for LinkedIn, Slack, iMessage, search previews.
export const dynamic = "force-static";
export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fafafa",
          backgroundImage:
            "linear-gradient(to right, rgba(24,24,27,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#18181b",
              color: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            DC
          </div>
          <div style={{ fontSize: 30, color: "#52525b" }}>diegocaputo.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 40, color: "#52525b", marginTop: 20 }}>{site.role}</div>
        </div>
      </div>
    ),
    size,
  );
}
