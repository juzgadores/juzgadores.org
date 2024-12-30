import { type Metadata } from "next/types";
import Link from "next/link";

import { validateUserInput } from "@/lib/validateUserInput";
import { aspirantesFilterBarFlag } from "@/lib/flags";
import {
  type AspiranteQueryParams,
  aspiranteQueryParamsSchema,
  getAspirantes,
} from "@/lib/data/aspirantes";
import { ASPIRANTES_PER_PAGE } from "@/lib/constants";
import { fetchMoreAspirantes } from "@/lib/actions/aspirantes";
import { PageSection } from "@/components/layout/page-section";
import { AspiranteGridList } from "@/components/aspirante/aspirante-grid-list";
import { AspiranteFilterBar } from "@/components/aspirante/aspirante-filter-bar";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AspirantesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const filtersEnabled = await aspirantesFilterBarFlag();

  const { data: filters, error } = await validateUserInput(
    aspiranteQueryParamsSchema,
    searchParams as unknown as Promise<AspiranteQueryParams | undefined>,
  );

  if (error) {
    throw new Error(
      "Filtros inválidos. " + error.map((e) => e.message).join(", "),
    );
  }

  const initialAspirantes = await getAspirantes({
    ...filters,
    limit: ASPIRANTES_PER_PAGE,
    offset: 0,
  });

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
      {filtersEnabled && (
        <AspiranteFilterBar
          filters={{
            ...filters,
            offset: filters?.offset ?? 0,
            limit: filters?.limit ?? ASPIRANTES_PER_PAGE,
          }}
        />
      )}

      <AspiranteGridList
        filters={filters}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={fetchMoreAspirantes}
      />
    </PageSection>
  );
}

export const metadata: Metadata = {
  title: "Aspirantes a personas juzgadoras del Poder Judicial",
  description:
    "Aspirantes aprobados para elección popular de personas juzgadoras del Poder Judicial por el Comité de Evaluación del Poder Judicial de la Federación",
  openGraph: {
    title: "Aspirantes a personas juzgadoras del Poder Judicial",
    description:
      "Aspirantes aprobados para elección popular de personas juzgadoras del Poder Judicial por el Comité de Evaluación del Poder Judicial de la Federación",
    type: "website",
  },
};
