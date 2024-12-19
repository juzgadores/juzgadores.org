import { type Metadata } from "next/types";
import { notFound } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { aspiranteLinksFlag } from "@/lib/flags";
import { getAspiranteBySlug } from "@/lib/data";
import { AspiranteProfileCard } from "@/components/aspirante/profile-card";
import { AspiranteLinksCard } from "@/components/aspirante/links-card";

type PageParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<PageParams>;
}>): Promise<Metadata> {
  const aspirante = await getAspiranteBySlug((await params).slug);
  return aspirante
    ? {
        title: aspirante.nombre,
        description: `Perfil de ${aspirante.nombre}, aspirante al cargo de ${aspirante.cargo} en el Poder Judicial de la Federación`,
        keywords: `${aspirante.nombre}, ${aspirante.cargo}, Poder Judicial de la Federación`,
        openGraph: {
          title: `${aspirante.nombre} - ${aspirante.cargo}`,
          description: `Perfil de ${aspirante.nombre}, ${aspirante.cargo} en el Poder Judicial de la Federación`,
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
  const aspirante = await getAspiranteBySlug((await params).slug);

  if (!aspirante) {
    notFound();
  }

  const links = await aspiranteLinksFlag();

  return (
    <>
      <Link
        className="text-muted-foreground hover:text-primary"
        href="/aspirantes"
      >
        ← Lista de aspirantes
      </Link>
      <div className={cn("grid gap-6", { "md:grid-cols-3": links })}>
        <AspiranteProfileCard
          className={cn("px-4", {
            "md:col-span-2": links,
            "md:min-w-[400px]": !links,
          })}
          aspirante={aspirante}
        />
        {links && <AspiranteLinksCard aspirante={aspirante} />}
      </div>
    </>
  );
}