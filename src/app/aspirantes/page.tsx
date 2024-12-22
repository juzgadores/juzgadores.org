import { type Metadata } from "next/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { filter } from "lodash-es";

import { validateUserInput } from "@/lib/validateUserInput";
import { aspirantesFilterBarFlag } from "@/lib/flags";
import {
  type AspiranteFilters,
  aspiranteFiltersSchema,
  getAspirantes,
} from "@/lib/data/aspirantes";
import { fetchMoreAspirantes } from "@/lib/actions/aspirantes";
import { PageSection } from "@/components/layout/page-section";
import { AspiranteGridList } from "@/components/aspirante/grid-list";
import { AspiranteFilterBar } from "@/components/aspirante/filter-bar";
export const metadata: Metadata = {
  title: "Aspirantes a personas juzgadoras",
  description:
    "Lista de los aspirantes aprobados por el Comité de Evaluación del Poder Judicial de la Federación",
};

export default async function AspirantesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const filterEnabled = await aspirantesFilterBarFlag();

  const { data: filters, error } = await validateUserInput(
    aspiranteFiltersSchema,
    searchParams as unknown as Promise<AspiranteFilters | undefined>,
  );

  if (error) {
    throw new Error(
      "Filtros inválidos. " + error.map((e) => e.message).join(", "),
    );
  }

  const initialAspirantes = await getAspirantes(filters);

  return (
    <PageSection
      heading="Conoce a los aspirantes"
      description={
        <>
          Estos son los aspirantes aprobados por el Comité de Evaluación del
          Poder Judicial de la Federación, según lo publicado el{" "}
          <Link
            className="underline hover:text-primary"
            href="https://dof.gob.mx/index.php/index_113.php?year=2024&month=12&day=15#gsc.tab=0"
          >
            15 de diciembre de 2024
          </Link>{" "}
          en el Diario Oficial de la Federación.
        </>
      }
    >
      {filterEnabled && <AspiranteFilterBar filters={filters} />}
      <AspiranteGridList
        filters={filters}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={fetchMoreAspirantes}
      />
    </PageSection>
  );
}
