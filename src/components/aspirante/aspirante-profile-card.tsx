import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import {
  judicaturaData as judicaturaData,
  judicatura,
  MateriaKey,
} from "@/lib/data/judicatura";
import { Aspirante } from "@/lib/data";

import { AspiranteAvatar } from "./aspirante-avatar";

interface AspiranteProfileCardProps {
  aspirante: Aspirante;
  className?: string;
}

export function AspiranteProfileCard({
  aspirante,
  className,
}: Readonly<AspiranteProfileCardProps>) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-4">
        <AspiranteAvatar className="size-16" aspirante={aspirante} />
        <div>
          <CardTitle className="text-3xl">{aspirante.nombre}</CardTitle>
          <CardDescription className="text-lg">
            Aspirante al cargo de {aspirante.cargo}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-muted-foreground">Género</dt>
            <dd>{aspirante.genero}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Expediente</dt>
            <dd>{aspirante.expediente}</dd>
          </div>
          {aspirante.sala && (
            <div>
              <dt className="font-medium text-muted-foreground">
                Sala Regional
              </dt>
              <dd>{aspirante.sala}</dd>
            </div>
          )}
          {aspirante.circuito && (
            <div>
              <dt className="font-medium text-muted-foreground">Circuito</dt>
              <dd>{aspirante.circuito}</dd>
            </div>
          )}
          {aspirante.materia && (
            <div>
              <dt className="font-medium text-muted-foreground">
                Especialidad
              </dt>
              <dd>
                <Badge variant="secondary">
                  {judicatura.materias[aspirante.materia as MateriaKey]}
                </Badge>
              </dd>
            </div>
          )}
          {aspirante.expediente && (
            <div>
              <dt className="font-medium text-muted-foreground">Número</dt>
              <dd>{aspirante.expediente}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
