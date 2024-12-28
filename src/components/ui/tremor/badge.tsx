// Tremor Badge [v0.0.1]

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cx } from "@/lib/utils";

const badgeVariants = tv({
  base: cx(
    "inline-flex items-center gap-x-1 rounded-md px-1.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
  ),
  variants: {
    variant: {
      default: [
        "bg-blue-50 text-blue-900 ring-blue-500/30",
        "dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30",
      ],
      neutral: [
        "bg-gray-50 text-gray-900 ring-gray-500/30",
        "dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
      ],
      success: [
        "bg-emerald-50 text-emerald-900 ring-emerald-600/30",
        "dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
      ],
      error: [
        "bg-red-50 text-red-900 ring-red-600/20",
        "dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
      ],
      warning: [
        "bg-yellow-50 text-yellow-900 ring-yellow-600/30",
        "dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20",
      ],
      morado: ["bg-[#8882D3] text-white ring-violet-500/30"],
      rosa: ["bg-[#C18CA4] text-white ring-rose-300/30"],
      verde: ["bg-[#83C8BC] text-foreground ring-green-300/30"],
      azul: ["bg-[#3D7D98] text-white ring-cyan-500/30"],
      anaranjado: ["bg-[#F5C5B8] text-foreground ring-red-300/30"],
      amarillo: ["bg-[#F1DB4B] text-foreground ring-yellow-500/30"],
      neutro: ["bg-accent text-foreground ring-border font-normal py-0.5"],
    },
  },
  defaultVariants: {
    variant: "neutro",
  },
});

// const colores = {
//   morado: ["#8882D3", "#FFFFFF"] as const,
//   rosa: ["#C18CA4", "#FFFFFF"] as const,
//   verde: ["#83C8BC", "#000000"] as const,
//   azul: ["#3D7D98", "#FFFFFF"] as const,
//   anaranjado: ["#F5C5B8", "#000000"] as const,
//   amarillo: ["#F1DB4B", "#000000"] as const,
//   neutro: ["#999999", "#000000"] as const,
// };

interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className={cx(badgeVariants({ variant }), className)}
        tremor-id="tremor-raw"
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, type BadgeProps };
