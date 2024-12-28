import { LuPlus } from "react-icons/lu";
import { LuExternalLink } from "react-icons/lu";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { type Aspirante } from "@/lib/data/aspirantes";

interface AspiranteLinksCardProps {
  aspirante: Aspirante;
}

export function AspiranteLinksCard({
  aspirante,
}: Readonly<AspiranteLinksCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enlaces y Recursos</CardTitle>
        <CardDescription>
          Información contextual sugerida por la comunidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <a
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              href="#"
            >
              <LuExternalLink />
              Perfil en LinkedIn de {aspirante.nombre}
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              href="#"
            >
              <LuExternalLink />
              Artículo en prensa local
            </a>
          </li>
        </ul>
        <Separator className="my-4" />
        <form className="flex gap-2">
          <Input placeholder="Agregar enlace..." />
          <Button size="icon" type="submit">
            <LuPlus className="size-4" />
            <span className="sr-only">Agregar enlace</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
