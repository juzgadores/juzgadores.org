import { z } from "zod";
import v from "voca";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

import { type Aspirante } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export function aspiranteToUri(aspirante: Aspirante) {
  const slug = v.slugify(aspirante.nombre);
  return `/aspirantes/${slug}`;
}

type ComboItemGetter<T> = keyof T | ((v: T) => string);

export function getComboItems<T>(
  obj: Record<string, T>,
  getter?: ComboItemGetter<T>,
): {
  value: string;
  label: string;
}[] {
  return Object.entries(obj).map(([value, item]) => ({
    value,
    label: (typeof getter === "function"
      ? getter(item)
      : getter
        ? item[getter]
        : item) as string,
  }));
}

/**
 * Creates a type-safe Zod enum from an object's keys, ensuring the keys match the expected type.
 *
 * @example
 * const colors = { red: '#ff0000', blue: '#0000ff' } as const;
 * type ColorKey = keyof typeof colors;
 * const colorEnum = createTypedEnum<ColorKey>(colors);
 */
export function createTypedEnum<T extends string>(
  obj: Record<T, unknown>,
): z.ZodEnum<[T, ...T[]]> {
  const keys = Object.keys(obj) as [T, ...T[]];
  if (keys.length === 0) {
    throw new Error("Object must have at least one key");
  }
  return z.enum(keys);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Helper for dev-only logs
 * @param args - The arguments to log
 */
export function debugLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}
