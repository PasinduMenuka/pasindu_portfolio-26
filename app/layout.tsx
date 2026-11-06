import "./globals.css";
import "./ency.css";
import "./case-study.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import AppShell from "@/components/app-shell";
import { PERSON, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, personJsonLd } from "@/lib/site";

// Fonts are bundled in app/fonts so builds and dev never depend on reaching Google Fonts.
const inter = localFont({ src: "./fonts/inter.woff2", weight: "100 900", variable: "--font-inter", display: "swap" });
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400" },
    { path: "./fonts/poppins-500.woff2", weight: "500" },
    { path: "./fonts/poppins-600.woff2", weight: "600" },
    { path: "./fonts/poppins-700.woff2", weight: "700" },
    { path: "./fonts/poppins-800.woff2", weight: "800" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const display = localFont({
  src: "./fonts/big-shoulders-display.woff2",
  weight: "800 900",
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});
const hand = localFont({ src: "./fonts/caveat.woff2", weight: "500 700", variable: "--font-hand", display: "swap", fallback: ["cursive"] });
const mono = localFont({ src: "./fonts/jetbrains-mono.woff2", weight: "400 500", variable: "--font-mono", display: "swap", fallback: ["ui-monospace", "monospace"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${PERSON.name}` },
  description: SITE_DESCRIPTION,
  applicationName: PERSON.name,
  keywords: [
    "Pasindu Sannasuriya",
    "Pasindu",
    "Sannasuriya",
    "Senior UI/UX Engineer",
    "UI/UX Designer Sri Lanka",
    "Product Designer Sri Lanka",
    "UX case study",
    "Figma designer",
    "Next.js developer",
    "IoT dashboard design",
    "E-commerce UX",
    "POS UX design",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: PERSON.name,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    firstName: "Pasindu",
    lastName: "Sannasuriya",
    username: "pasindu",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel once Search Console gives you the token.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  themeColor: "#0000ff",
  category: "portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${inter.variable} ${poppins.variable} ${display.variable} ${hand.variable} ${mono.variable}`;
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        {/* The site is designed light-only. Declare it so Chromium's auto dark mode (Brave, Edge, Opera
            "force dark pages", Samsung Internet) leaves our colors alone, and lock out Dark Reader-based
            night modes such as Brave's. */}
        <meta name="color-scheme" content="only light" />
        <meta name="darkreader-lock" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </head>
      <AppShell fontClassName={fonts}>{children}</AppShell>
    </html>
  );
}
