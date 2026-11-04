import { ImageResponse } from "next/server";
import { PERSON } from "@/lib/site";

export const runtime = "edge";
export const alt = `${PERSON.name} – Senior UI/UX Engineer & Product Designer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for LinkedIn, WhatsApp, X and Slack previews.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0000ff",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="190" height="89" viewBox="280 210 1225 575" fill="#ffffff">
          <path d="M289 218H822C895 218 950 278 950 350V365L750 507H522V640L414 773V408H800C825 408 843 388 843 362C843 338 825 318 800 318H395Z" />
          <path d="M1108 291Q720 560 458 776Q860 500 1108 291Z" fill="#ffd60a" />
          <path d="M1122 312H1496L1355 410H1062C1038 410 1020 428 1020 451C1020 474 1038 492 1062 492H1310C1388 492 1452 552 1452 624C1452 696 1388 756 1310 756H628L765 662H1310C1330 662 1344 645 1344 624C1344 603 1330 586 1310 586H1035C975 586 925 546 915 486Z" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>{PERSON.name}</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#ffd60a" }}>Senior UI/UX Engineer &amp; Product Designer</div>
          <div style={{ fontSize: 28, marginTop: 18, color: "#d2d0fa" }}>
            IoT dashboards · E-commerce · POS · Figma to Next.js · Sri Lanka
          </div>
        </div>
      </div>
    ),
    size,
  );
}
