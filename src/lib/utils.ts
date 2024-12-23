import v from "voca";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

import { type Aspirante } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function generatePlaceholderAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20);
  const lightness = 40 + Math.floor(Math.random() * 20);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials,
  )}&background=${encodeURIComponent(
    `hsl(${hue},${saturation}%,${lightness}%)`,
  )}&color=fff`;
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
