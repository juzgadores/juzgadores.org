import {
  type MateriaKey,
  type Aspirante,
  type OrganoKey,
  judicatura,
} from "@/lib/data";

interface AspirantePofileDetailsProps {
  aspirante: Aspirante;
}

export function AspiranteProfileDetails({
  aspirante,
}: Readonly<AspirantePofileDetailsProps>) {
  const organoKey = aspirante.organoSlug as OrganoKey;

  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-y-8 md:grid-cols-3">
      <dt className="text-sm font-medium text-muted-foreground">Expediente</dt>
      <dd className="text-sm">{aspirante.expediente}</dd>

      <dt className="text-sm font-medium text-muted-foreground">Género</dt>
      <dd className="text-sm">{aspirante.genero}</dd>

      {aspirante.sala && (
        <>
          <dt className="text-sm font-medium text-muted-foreground">Sala</dt>
          <dd className="text-sm">{aspirante.sala}</dd>
        </>
      )}
      {aspirante.circuito && (
        <>
          <dt className="text-sm font-medium text-muted-foreground">
            Circuito
          </dt>
          <dd className="text-sm">{aspirante.circuito}</dd>
        </>
      )}
      {aspirante.materia && (
        <>
          <dt className="text-sm font-medium text-muted-foreground">
            Especialidad
          </dt>
          <dd className="text-sm">
            {judicatura.materias[aspirante.materia as MateriaKey]}
          </dd>
        </>
      )}
      {aspirante.entidad && (
        <>
          <dt className="text-sm font-medium text-muted-foreground">Entidad</dt>
          <dd className="text-sm">{aspirante.entidad}</dd>
        </>
      )}
      {aspirante.organo && (
        <>
          <dt className="text-sm font-medium text-muted-foreground">Órgano</dt>
          <dd className="text-sm uppercase">
            {judicatura.organos[organoKey]?.nombre}
          </dd>
        </>
      )}
    </dl>
  );
}
