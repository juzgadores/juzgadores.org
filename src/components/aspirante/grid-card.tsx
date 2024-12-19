import Link from "next/link";

import { type Aspirante } from "@/lib/data/aspirantes";

import { AspiranteAvatar } from "./avatar";

type AspiranteGridCardProps = Readonly<{
  aspirante: Aspirante;
}>;

export function AspiranteGridCard({ aspirante }: AspiranteGridCardProps) {
  return (
    <Link
      className="group relative rounded-lg border p-6 hover:border-primary"
      href={`/aspirantes/${aspirante.slug}`}
    >
      <div className="flex flex-col justify-between space-y-2">
        <div className="flex items-center gap-4">
          <AspiranteAvatar
            className="size-10"
            aspirante={aspirante}
            fallbackClassName="text-md"
          />
          <div>
            <h3 className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {aspirante.nombre}
            </h3>
            <p className="text-xs text-muted-foreground">
              <span className="font-extralight">Aspirante a</span>{" "}
              {aspirante.cargo}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {aspirante.entidad && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset">
              {aspirante.entidad}
            </span>
          )}
          {aspirante.sala && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset">
              Sala {aspirante.sala}
            </span>
          )}
          {aspirante.circuito && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset">
              Circuito {aspirante.circuito}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
