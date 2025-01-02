import type { Metadata } from "next";

import { GeistSans as fontSans } from "geist/font/sans";
import { GeistMono as fontMono } from "geist/font/mono";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { cn } from "@/lib/utils";
import { BASE_URL } from "@/lib/constants";

import "./globals.css";

import { PathBreadcrumb } from "@/components/path-breadcrumb";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(fontSans.variable, fontMono.variable, "antialiased")}
      lang="es"
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="container mx-auto p-4">
            <PathBreadcrumb />
          </div>
        </header>
        <div className="flex-1">
          <div className="container mx-auto px-4">
            <main className="relative">{children}</main>
          </div>
        </div>

        <Footer />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | juzgadores.org",
    default:
      "Juzgadores - Portal abierto ciudadano para el proceso de elección de personas juzgadoras en México en 2025",
  },
  description:
    "Portal abierto sobre la elección de personas juzgadoras en México en 2025",
  keywords: [
    "poder judicial",
    "elecciones",
    "personas juzgadoras",
    "tómbola",
    "juzgadores",
    "jueces",
    "ministros",
    "magistrados",
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "juzgadores.org",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
