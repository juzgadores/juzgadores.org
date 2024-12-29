import v from "voca";

import { cn } from "@/lib/utils";
import type { Aspirante } from "@/lib/data";

interface AspiranteDefinitionListProps {
  aspirante: Aspirante;
}

export function AspiranteDefinitionList({
  aspirante,
}: Readonly<AspiranteDefinitionListProps>) {
  const definitionItems: { label: string; value: string | undefined }[] = [
    {
      label: "Órgano",
      value:
        aspirante.organo?.nombre +
        (aspirante.organo?.siglas ? ` (${aspirante.organo?.siglas})` : ""),
    },
    { label: "Cargo", value: v.titleCase(aspirante.titulo) },
    {
      label: "Entidad federativa",
      value: aspirante.entidad?.nombre ?? "Toda la República Mexicana",
    },
    { label: "Sala", value: aspirante.sala?.nombre },
    { label: "Materia", value: aspirante.materia?.nombre },
    { label: "Circuito", value: aspirante.circuito?.nombre },
    { label: "Expediente", value: aspirante.expediente },
  ];

  return (
    <dl className="grid grid-cols-2 gap-5 md:grid-cols-3">
      {definitionItems.map((item) => (
        <AspiranteDescriptionItem
          key={item.label}
          value={item.value}
          label={item.label}
        />
      ))}
    </dl>
  );
}

function AspiranteDescriptionItem({
  label,
  value,
  className,
  termClassName,
  definitionClassName,
}: {
  label: string;
  value: string | undefined;
  className?: string;
  termClassName?: string;
  definitionClassName?: string;
}) {
  return (
    value !== undefined && (
      <div className={className}>
        <dt className={cn("text-muted-foreground", termClassName)}>{label}</dt>
        <dd className={cn("font-light text-sm", definitionClassName)}>
          {value}
        </dd>
      </div>
    )
  );
}
