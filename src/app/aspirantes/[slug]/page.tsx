import { type Metadata } from "next/types";
import { notFound } from "next/navigation";

import { debugLog } from "@/lib/utils";
import { aspiranteCurriculumFlag } from "@/lib/flags";
import { getAspiranteBySlug, getAspirantes } from "@/lib/data";
import { BASE_URL } from "@/lib/constants";
import { BackToListLink } from "@/components/aspirante/back-to-list-link";
import { AspiranteProfileCard } from "@/components/aspirante/aspirante-profile-card";

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
    <div className="container mx-auto max-w-5xl pt-16">
      <BackToListLink />
      <AspiranteProfileCard
        aspirante={aspirante}
        curriculumComponent={curriculumComponent}
      />
    </div>
  );
}

export async function generateStaticParams() {
  const aspirantes = await getAspirantes({ limit: Infinity, offset: 0 });
  return aspirantes.map(({ slug }) => ({ slug }));
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
