import { type Metadata } from "next/types";
import { notFound } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { aspiranteLinksFlag } from "@/lib/flags";
import { getAspiranteBySlug } from "@/lib/data";
import { AspiranteProfileCard } from "@/components/aspirante/aspirante-profile-card";
import { AspiranteLinksCard } from "@/components/aspirante/aspirante-links-card";

type PageParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<PageParams>;
}>): Promise<Metadata> {
  const slug = (await params).slug;
  const aspirante = await getAspiranteBySlug(slug);

  return aspirante
    ? {
        title: aspirante.nombre,
        description: `Perfil de ${aspirante.nombre}, aspirante al cargo de ${aspirante.cargo} del Poder Judicial de la Federación por elección popular en 2025`,
        keywords: `${aspirante.nombre}, ${aspirante.materia},${aspirante.cargo}, Poder Judicial de la Federación`,
        openGraph: {
          title: `${aspirante.nombre} - Aspirante a ${aspirante.cargo}`,
          description: `Perfil de ${aspirante.nombre}, aspirante al cargo de ${aspirante.cargo} del Poder Judicial de la Federación por elección popular en 2025`,
          url: `https://juzgadores.org/aspirantes/${aspirante.slug}`,
          type: "profile",
        },
      }
    : {
        title: "Not Found",
        description: "The page you are looking for does not exist",
        keywords: "not found, error, page not found",
        openGraph: {
          title: "Not Found",
          type: "website",
        },
      };
}

export default async function AspirantePage({
  params,
}: Readonly<{ params: Promise<PageParams> }>) {
  const slug = (await params).slug;
  const aspirante = await getAspiranteBySlug(slug);

  if (!aspirante) {
    notFound();
  }

  let Curriculum = null;
  try {
    Curriculum = (await import(`@/curricula/${slug}.mdx`)).default;
  } catch (error) {}

  const links = await aspiranteLinksFlag();

  return (
    <div
      className={cn(
        "grid max-w-fit mx-auto pt-16 gap-6",
        links && "md:grid-cols-3",
      )}
    >
      <AspiranteProfileCard
        className={cn("px-14 py-3", {
          "md:col-span-2": links,
          "md:min-w-[400px]": !links,
        })}
        aspirante={aspirante}
      />
      {links && <AspiranteLinksCard aspirante={aspirante} />}
      {Curriculum && (
        <div className="prose">
          <Curriculum />
        </div>
      )}
    </div>
  );
}
