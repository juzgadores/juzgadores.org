import { GeistSans as fontSans } from "geist/font/sans";
import { GeistMono as fontMono } from "geist/font/mono";

import type { Metadata } from "next";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { cn } from "@/lib/utils";

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
      lang="es"
      className={cn(fontSans.variable, fontMono.variable, "antialiased")}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <PathBreadcrumb className="container mx-auto" />
        </header>
        <div className="mx-auto flex min-h-screen flex-col px-4">
          <div className="flex-1 py-6 md:py-8">
            <main className="relative">{children}</main>
          </div>

          <Footer />
        </div>

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
  metadataBase: new URL("https://juzgadores.org"),
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
