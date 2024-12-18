import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Datos Oficiales de Personas Elegibles para el Proceso Electoral Judicial 2024-2025",
  description: "Consulta los listados oficiales de personas elegibles aprobados por el Comité de Evaluación del Poder Judicial de la Federación, publicados en el Diario Oficial de la Federación.",
  openGraph: {
    title: "Juzgadores.org",
    description: "Portal Abierto para decidir cómo elegir a las personas juzgadoras en México",
    url: "https://juzgadores.org",
    siteName: "juzgadores.org",
    images: [
      {
        url: "/logo.png",
        width: 180,
        height: 38,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
