import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

import { getAspiranteColor, cn } from "@/lib/utils";
import type { Aspirante } from "@/lib/data";

interface AspiranteAvatarProps {
  aspirante: Aspirante;
  className?: string;
  fallbackClassName?: string;
}

export function AspiranteAvatar({
  aspirante,
  className,
  fallbackClassName,
}: Readonly<AspiranteAvatarProps>) {
  const [bgColor, textColor] = getAspiranteColor(aspirante);

  return (
    <Avatar className={cn("size-16", className)}>
      <AvatarImage alt={aspirante.nombre} />
      <AvatarFallback
        className={cn("text-2xl text-foreground", fallbackClassName)}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {aspirante.nombre
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
