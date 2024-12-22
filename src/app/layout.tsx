import { Geist_Mono, Geist } from "next/font/google";
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";

import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import Breadcrumbs from "@/components/breadcrumbs";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    "México",
    "2025",
    "tómbola",
    "juez",
    "ministro",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen flex flex-col bg-background text-foreground px-4",
        )}
      >
        <div className="container mx-auto flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-4">
              <Breadcrumbs
                activeClasses="text-muted-foreground"
                listClasses="hover:underline mx-2 font-semibold"
                containerClasses="flex py-5"
                homeElement="Inicio"
                separator={
                  <span className="mx-2 text-muted-foreground">/</span>
                }
                capitalizeLinks
              />
            </div>
          </header>

          <div className="flex-1 py-6 md:py-8">
            <main className="relative">{children}</main>
          </div>

          <Footer />

          <Analytics />
        </div>
      </body>
    </html>
  );
}
