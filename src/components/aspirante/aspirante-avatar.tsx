import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Aspirante } from "@/lib/data";
import { cn, getInitials } from "@/lib/utils";

interface AspiranteAvatarProps {
  aspirante: Aspirante;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AspiranteAvatar({
  aspirante,
  className,
  fallbackClassName,
  size = "md",
}: Readonly<AspiranteAvatarProps>) {
  const sizeClasses = {
    sm: "size-12 text-md",
    md: "size-14 text-xl",
    lg: "size-20 text-3xl",
    xl: "size-24 text-4xl",
  };

  const initials = getInitials(aspirante.nombre);

  return (
    <Avatar
      className={cn(sizeClasses[size], "ring-1 ring-foreground/30", className)}
      aria-label={`Imagen de ${aspirante.nombre}`}
      role="img"
    >
      <AvatarImage alt={`Imagen de ${aspirante.nombre}`} />
      <AvatarFallback
        aria-hidden="true"
        className={cn("text-foreground", fallbackClassName)}
        style={{
          backgroundColor: aspirante.color.bg,
          color: aspirante.color.text,
        }}
        role="presentation"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
