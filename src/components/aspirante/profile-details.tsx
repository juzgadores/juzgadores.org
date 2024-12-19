import { judicatura, MateriaKey, Aspirante, OrganoKey } from "@/lib/data";

interface AspirantePofileDetailsProps {
  aspirante: Aspirante;
}

export function AspirantePofileDetails({
  aspirante,
}: Readonly<AspirantePofileDetailsProps>) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            {judicatura.organos[aspirante.organo as OrganoKey]?.nombre}
          </dd>
        </>
      )}
    </dl>
  );
}
