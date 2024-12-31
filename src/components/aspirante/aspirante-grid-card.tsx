import Link from "next/link";

import { Badge } from "@/components/ui/tremor/badge";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";

import type { Aspirante } from "@/lib/data";

import { AspiranteAvatar } from "./aspirante-avatar";

type AspiranteGridCardProps = {
  aspirante: Aspirante;
};

export function AspiranteGridCard({
  aspirante,
}: Readonly<AspiranteGridCardProps>) {
  return (
    <Card className="flex flex-col p-2">
      <Link
        className="transition-all duration-300 hover:bg-accent"
        href={`/aspirantes/${aspirante.slug}`}
      >
        <CardHeader className="flex flex-row items-center gap-3 p-2">
          <AspiranteAvatar aspirante={aspirante} size="sm" />
          <div className="flex min-w-0 flex-col">
            <CardTitle className="truncate text-lg" title={aspirante.nombre}>
              {aspirante.nombre}
            </CardTitle>
            <CardDescription className="text-xs">
              Aspirante a <Badge className="text-xs">{aspirante.titulo}</Badge>{" "}
              {aspirante.organo.conector || "de"}{" "}
              <Badge className="text-xs">
                {aspirante.organo.siglas ?? aspirante.organo.nombre}
              </Badge>
            </CardDescription>
            {/* <CardDescription className="text-sm">
              Aspirante a <Badge>{aspirante.titulo}</Badge>{" "}
              {aspirante.organo.conector || "de"}
              <Badge className="whitespace-normal">
                {aspirante.organo.nombre}
              </Badge>
            </CardDescription> */}
          </div>
        </CardHeader>
      </Link>

      {/* <CardFooter className="flex flex-row flex-wrap justify-end font-extralight">
        <BadgeTooltip
          className="font-light"
          href={`/aspirantes?organo=${aspirante.organoSlug}`}
        >
          {aspirante.organo.nombre}
          {aspirante.organo.siglas ? ` (${aspirante.organo.siglas})` : ""}
        </BadgeTooltip>
      </CardFooter> */}
    </Card>
  );
}

// function AspiranteBadge({
//   label,
//   value,
//   className,
//   ...props
// }: Readonly<{ label: string; value: string } & Partial<BadgeProps>>) {
//   return (
//     <Badge
//       className={cn("font-normal text-xs px-2 py-1", className)}
//       variant="outline"
//       aria-description={label}
//       {...props}
//     >
//       {value}
//     </Badge>
//   );
// }
