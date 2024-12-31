import { Separator } from "@/components/ui/indieui/separator";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { type Aspirante } from "@/lib/data";

import { AspiranteDefinitionList } from "./aspirante-definition-list";
import { AspiranteAvatar } from "./aspirante-avatar";
import { Label } from "../ui/field";

interface AspiranteProfileCardProps {
  aspirante: Aspirante;
  curriculumComponent?: React.ComponentType<any>;
  className?: string;
}

export function AspiranteProfileCard({
  aspirante,
  curriculumComponent: Curriculum,
  className,
}: Readonly<AspiranteProfileCardProps>) {
  return (
    <Card className={cn("max-w-screen-lg", className)}>
      <CardHeader className="flex flex-col items-center gap-6 p-8 pb-0 sm:flex-row sm:items-start">
        <AspiranteAvatar aspirante={aspirante} size="lg" />
        <div className="text-center sm:text-left">
          <CardTitle className="mb-1 text-3xl font-bold">
            {aspirante.nombre}
          </CardTitle>
          <CardDescription className="text-xl font-medium text-muted-foreground">
            Aspirante al cargo de {aspirante.cargo}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <CardSeparator label="Detalles del cargo" />
        <AspiranteDefinitionList aspirante={aspirante} />
        {Curriculum && (
          <>
            <CardSeparator label="Datos curriculares" />
            <div className="prose">
              <Curriculum />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function CardSeparator({ label }: { label: string }) {
  return (
    <Separator
      className="my-8"
      label={
        <div className="rounded-xl border px-3 py-0.5 text-sm font-semibold tracking-widest">
          {label}
        </div>
      }
      gradient
    />
  );
}
