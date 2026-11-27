import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Geist_Mono } from "next/font/google";
import { profile } from "@/data/content";
import { Aurora } from "@/components/ui/Aurora";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description =
  "Backend software engineer in Cairo building multi-tenant SaaS in Python: Sanade, the UAE national e-invoicing platform on Peppol, a GRC platform, and enterprise systems for the Abu Dhabi Judicial Department. Java and Spring Boot background. Open to remote work.";

/* Set NEXT_PUBLIC_SITE_URL in the host's env once the domain is live —
   canonical and social-card URLs resolve against it. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohmaed-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "Backend Software Engineer",
    "Python",
    "FastAPI",
    "E-invoicing",
    "Peppol",
    "Celery",
    "Java",
    "Spring Boot",
    "Django",
    "PostgreSQL",
    "RabbitMQ",
    "Multi-tenant",
    "Cairo",
    "Mohamed Elsayed",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    title: `${profile.name} — ${profile.role}`,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${geistMono.variable}`}>
      <body className="bg-bg text-ink-dim antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:font-medium focus:text-bg-sunken"
        >
          Skip to content
        </a>
        <Aurora />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
