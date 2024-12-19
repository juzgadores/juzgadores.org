import { type Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Aspirantes a personas juzgadoras",
  description:
    "Lista de los aspirantes aprobados por el Comité de Evaluación del Poder Judicial de la Federación",
};

export default function AspirantesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
