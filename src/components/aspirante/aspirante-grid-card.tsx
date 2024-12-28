import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/tremor/badge";

import type { Aspirante } from "@/lib/data";

import { AspiranteAvatar } from "./aspirante-avatar";

type AspiranteGridCardProps = {
  aspirante: Aspirante;
};

export function AspiranteGridCard({
  aspirante,
}: Readonly<AspiranteGridCardProps>) {
  return (
    <Card className="flex flex-col">
      <Link
        className="transition-all duration-300 hover:bg-accent"
        href={`/aspirantes/${aspirante.slug}`}
      >
        <CardHeader className="flex flex-row items-center gap-3 p-2">
          <AspiranteAvatar aspirante={aspirante} size="sm" />
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-lg truncate" title={aspirante.nombre}>
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
