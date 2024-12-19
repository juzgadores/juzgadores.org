import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
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
  return (
    <Avatar className={cn("size-14 ", className)}>
      <AvatarImage alt={aspirante.nombre} />
      <AvatarFallback
        className={cn("bg-gray-800 text-2xl text-white", fallbackClassName)}
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
