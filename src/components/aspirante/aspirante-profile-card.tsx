import { Separator } from "@/components/ui/indieui/separator";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";

import { type Aspirante } from "@/lib/data";

import { AspiranteDefinitionList } from "./aspirante-definition-list";
import { AspiranteAvatar } from "./aspirante-avatar";
import { Label } from "../ui/field";

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
      <CardHeader className="flex flex-col items-center gap-6 pb-3 sm:flex-row sm:items-start">
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

      <Separator
        className="my-6"
        label={
          <div className="border px-3 py-0.5 text-sm tracking-widest font-semibold rounded-xl">
            Detalles
          </div>
        }
        gradient
      />

      <CardContent className="mt-3">
        <AspiranteDefinitionList aspirante={aspirante} />
      </CardContent>
    </Card>
  );
}
