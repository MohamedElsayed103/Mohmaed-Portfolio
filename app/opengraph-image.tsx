import { ImageResponse } from "next/og";
import { profile } from "@/data/content";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Social card. Built from the same palette as the site so a LinkedIn or
   WhatsApp preview reads as the same object as the page it links to. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0e0e",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{ width: 14, height: 14, borderRadius: 99, background: "#f3604d" }}
          />
          <div style={{ fontSize: 26, color: "#949494", letterSpacing: 1 }}>
            {profile.availability}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              color: "#f7f7f7",
              lineHeight: 1.02,
              letterSpacing: -3,
            }}
          >
            Mohamed Elsayed
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
            <div style={{ fontSize: 40, color: "#f3604d", fontWeight: 600 }}>
              {profile.role}
            </div>
            <div style={{ width: 2, height: 34, background: "#313131" }} />
            <div style={{ fontSize: 36, color: "#949494" }}>{profile.location}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 25,
            color: "#707070",
            borderTop: "1px solid #232323",
            paddingTop: 28,
          }}
        >
          {["Java", "Spring Boot", "Python", "Django", "PostgreSQL", "RabbitMQ", "Docker"].map(
            (t) => (
              <div key={t}>{t}</div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
