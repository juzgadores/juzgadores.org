import { type Metadata } from "next/types";
import Link from "next/link";

import { Separator } from "@/components/ui/indieui/separator";

import { validateRequestParams } from "@/lib/validateUserInput";
import { aspirantesFilterBarFlag } from "@/lib/flags";
import {
  aspiranteQueryParamsSchema,
  getAspirantes,
} from "@/lib/data/aspirantes";
import { fetchMoreAspirantes } from "@/lib/actions/aspirantes";
import { PageSection } from "@/components/layout/page-section";
import { AspiranteGridList } from "@/components/aspirante/aspirante-grid-list";
import { AspiranteFilterBar } from "@/components/aspirante/aspirante-filter-bar";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AspirantesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const filtersEnabled = await aspirantesFilterBarFlag();

  const { data: params, error } = await validateRequestParams(
    aspiranteQueryParamsSchema,
    searchParams,
  );

  if (error) {
    throw new Error(
      "Filtros inválidos. " + error.map((e) => e.message).join(", "),
    );
  }

  const initialAspirantes = await getAspirantes(params);

  return (
    <PageSection
      heading="Aspirantes a personas juzgadoras"
      description={
        <>
          Estos son los aspirantes aprobados por el Comité de Evaluación del
          Poder Judicial de la Federación, según publicado el{" "}
          <Link
            className="underline hover:text-primary"
            href="https://dof.gob.mx/index.php/index_113.php?year=2024&month=12&day=15#gsc.tab=0"
          >
            15 de diciembre de 2024
          </Link>{" "}
          en el Diario Oficial de la Federación para la elección popular de
          personas juzgadoras del Poder Judicial de la Federación en el año
          2025.
        </>
      }
    >
      <Separator className="my-1" />

      {filtersEnabled && (
        <AspiranteFilterBar className="mb-10 mt-5" filters={params} />
      )}

      <AspiranteGridList
        initialAspirantes={initialAspirantes}
        params={params}
        fetchMoreAspirantes={fetchMoreAspirantes}
      />
    </PageSection>
  );
}

export const metadata: Metadata = {
  title: "Lista de candidatos del Poder Judicial",
  description:
    "Candidatos a elección popular de cargos de personas juzgadoras del Poder Judicial de la Federación",
  openGraph: {
    title: "Lista de candidatos del Poder Judicial",
    description:
      "Candidatos a elección popular de cargos de personas juzgadoras del Poder Judicial de la Federación",
    type: "website",
  },
};
