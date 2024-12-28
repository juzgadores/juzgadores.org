import Link from "next/link";

import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { BadgeProps, Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

interface BadgeTooltipProps {
  tooltip?: string;
  className?: string;
  variant?: BadgeProps["variant"];
  href?: string;
  children: React.ReactNode;
}

export function BadgeTooltip({
  tooltip,
  variant = "outline",
  className,
  href,
  children,
}: BadgeTooltipProps) {
  const badge = (
    <Badge
      className={cn("gap-1.5", href && "hover:bg-accent", className)}
      variant={variant}
    >
      {children}
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          {href ? <Link href={href}>{badge}</Link> : badge}
        </TooltipTrigger>
        {tooltip && <TooltipContent side="right">{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
