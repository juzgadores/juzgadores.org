import { type Metadata } from "next/types";
import { notFound } from "next/navigation";

import { debugLog, cn } from "@/lib/utils";
import { aspiranteCurriculumFlag, aspiranteLinksFlag } from "@/lib/flags";
import { getAspiranteBySlug } from "@/lib/data";
import { BASE_URL } from "@/lib/constants";
import { AspiranteProfileCard } from "@/components/aspirante/aspirante-profile-card";
import { AspiranteLinksCard } from "@/components/aspirante/aspirante-links-card";

type AspirantePageParams = {
  slug: string;
};

export default async function AspirantePage({
  params,
}: Readonly<{ params: Promise<AspirantePageParams> }>) {
  const slug = (await params).slug;
  const aspirante = await getAspiranteBySlug(slug);

  if (!aspirante) {
    notFound();
  }

  const hasLinks = await aspiranteLinksFlag();

  let curriculumComponent: React.ComponentType<any> | undefined;

  if (await aspiranteCurriculumFlag()) {
    try {
      const filename = `${aspirante.slug}.mdx`;
      curriculumComponent = (await import(`@/curricula/${filename}`)).default;
    } catch (error) {
      debugLog(error);
    }
  }

  return (
    <div
      className={cn(
        "grid max-w-fit mx-auto pt-16 gap-6",
        hasLinks && "md:grid-cols-3",
      )}
    >
      <AspiranteProfileCard
        className={cn(hasLinks ? "md:col-span-2" : "md:min-w-[400px]")}
        aspirante={aspirante}
        curriculumComponent={curriculumComponent}
      />

      {hasLinks && <AspiranteLinksCard aspirante={aspirante} />}
    </div>
  );
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<AspirantePageParams>;
}>): Promise<Metadata> {
  const slug = (await params).slug;
  const aspirante = await getAspiranteBySlug(slug);

  return aspirante
    ? {
        title: aspirante.nombre + " | Elecciones del Poder Judicial 2025",
        description: `Perfil de ${aspirante.nombre}, aspirante al cargo de ${aspirante.cargo} del Poder Judicial de la Federación por elección popular en 2025`,
        keywords: `${aspirante.nombre}, ${aspirante.materia},${aspirante.cargo}, Poder Judicial de la Federación`,
        openGraph: {
          title: `${aspirante.nombre} - Aspirante a ${aspirante.cargo}`,
          description: `Perfil de ${aspirante.nombre}, aspirante al cargo de ${aspirante.cargo} del Poder Judicial de la Federación por elección popular en 2025`,
          url: `${BASE_URL}/aspirantes/${aspirante.slug}`,
          type: "profile",
          countryName: "México",
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
