"use client";

import { useCallback, useMemo } from "react";
import {
  ReadonlyURLSearchParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";

import v from "voca";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { getComboItems, cn } from "@/lib/utils";
import type {
  AspiranteQueryParams,
  OrganoKey,
  TituloKey,
  SalaKey,
} from "@/lib/data";
import { judicatura as j } from "@/lib/data";
import { ComboboxFilter } from "@/components/combobox-filter";

type ComboKey = Exclude<
  keyof AspiranteQueryParams,
  "nombre" | "offset" | "limit"
>;

type DisplayState = {
  visible: boolean;
  disabled: boolean;
  value: string;
  items?: Array<{ value: string; label: string; disabled?: boolean }>;
};

/**
 * Get the list of organos that have the specified titulo
 */
function getOrganosForTitulo(titulo: TituloKey): OrganoKey[] {
  return Object.entries(j.organos)
    .filter(([_, organo]) => organo.titulo === titulo)
    .map(([key]) => key as OrganoKey);
}

// Define the combos in a single array
const combos: {
  key: ComboKey;
  label: string;
  items: Array<{ value: string; label: string; disabled?: boolean }>;
}[] = [
  {
    key: "titulo",
    label: "cargo vacante",
    items: getComboItems(
      j.titulos,
      ({ singular: { Femenino: f, Masculino: m } }) =>
        `${v.capitalize(f)} / ${m}`,
    ),
  },
  {
    key: "organo",
    label: "órgano judicial",
    items: getComboItems(j.organos, "nombre"),
  },
  {
    key: "sala",
    label: "sala",
    items: getComboItems(
      (j.organos.tepjf as { salas: Record<string, { nombre: string }> }).salas,
      "nombre",
    ),
  },
  // {
  //   key: "entidad",
  //   label: "entidad federativa",
  //   items: getComboItems(j.entidades),
  // },
  {
    key: "circuito",
    label: "circuito judicial",
    items: getComboItems(j.circuitos, "nombre"),
  },
  // {
  //   key: "materia",
  //   label: "materia",
  //   items: getComboItems(j.materias),
  // },
  {
    key: "genero",
    label: "género",
    items: [
      { value: "Masculino", label: "Masculino" },
      { value: "Femenino", label: "Femenino" },
      { value: "Indistinto", label: "Indistinto" },
    ],
  },
] as const;

/**
 * Map of which filters should be cleared when another filter changes.
 * e.g. Changing "organo" clears "sala" and "circuito".
 */
const dependencies: Record<ComboKey, ComboKey[]> = {
  organo: ["sala", "circuito", "titulo"], // organo changes => clear sala, circuito & titulo
  titulo: ["organo", "sala", "circuito"], // titulo changes => clear organo & its dependents
  sala: ["entidad"], // sala changes => clear entidad
  entidad: [],
  materia: [],
  circuito: [],
  genero: [],
};

/**
 * Determines how each filter is displayed: visible/hidden, disabled, or locked to a specific value.
 */
function getDisplayState(
  key: ComboKey,
  filters: Record<ComboKey, string>,
  comboItems: Array<{ value: string; label: string }>,
): DisplayState {
  switch (key) {
    case "organo": {
      // If a titulo is selected, disable organos that don't match
      if (filters.titulo) {
        const validOrganos = getOrganosForTitulo(filters.titulo as TituloKey);
        const items = comboItems.map((item) => ({
          ...item,
          disabled: !validOrganos.includes(item.value as OrganoKey),
        }));
        return {
          visible: true,
          disabled: false,
          value: filters.organo || "",
          items,
        };
      }
      return {
        visible: true,
        disabled: false,
        value: filters.organo ?? "",
        items: comboItems,
      };
    }

    case "titulo":
      if (filters.organo) {
        // Lock 'titulo' to the organo's title
        const organo = j.organos[filters.organo as OrganoKey];
        const value = organo?.titulo ?? "";
        return {
          visible: true,
          disabled: true,
          value,
          items: comboItems,
        };
      }
      return {
        visible: true,
        disabled: false,
        value: filters.titulo ?? "",
        items: comboItems,
      };

    case "sala":
      return {
        visible: filters.organo === "tepjf",
        disabled: false,
        value: filters.sala ?? "",
        items: comboItems,
      };

    case "entidad":
      // If organo === 'tepjf' and the chosen sala has no entidades, hide
      if (filters.organo === "tepjf" && filters.sala) {
        const salaData = j.organos.tepjf.salas?.[filters.sala as SalaKey];
        if (salaData?.entidades === null) {
          return {
            visible: false,
            disabled: false,
            value: "",
            items: comboItems,
          };
        }
      }
      return {
        visible: true,
        disabled: false,
        value: filters.entidad || "",
        items: comboItems,
      };

    case "circuito":
      return {
        visible: filters.organo !== "tepjf",
        disabled: false,
        value: filters.circuito || "",
        items: comboItems,
      };

    default:
      return {
        visible: false,
        disabled: false,
        value: "",
        items: comboItems,
      };
  }
}

interface AspiranteFilterBarProps {
  filters: AspiranteQueryParams;
  className?: string;
}

/**
 * Main filter bar component for aspirantes.
 */
export function AspiranteFilterBar({
  filters,
  className,
}: Readonly<AspiranteFilterBarProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentFilters = useMemo(() => {
    // Create a map of filter values from URL params or prop filters
    return combos.reduce(
      (acc, { key }) => ({
        ...acc,
        [key]: searchParams.get(key) ?? filters[key] ?? "",
      }),
      {} as Record<ComboKey, string>,
    );
  }, [searchParams, filters]);

  const handleChange = useCallback(
    (key: ComboKey | "nombre", newValue: string) => {
      function updateParams(params: ReadonlyURLSearchParams): URLSearchParams {
        const updatedParams = new URLSearchParams(params);

        // Clear dependent filters when changing parent filter
        if (key in dependencies && key !== "nombre") {
          dependencies[key]?.forEach((dep) => updatedParams.delete(dep));
        }

        // Update or remove the filter value
        newValue ? updatedParams.set(key, newValue) : updatedParams.delete(key);

        return updatedParams;
      }

      const queryString = updateParams(searchParams).toString();
      router.push(`${pathname}?${queryString}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className={cn("flex gap-5", className)}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchParams.get("nombre") ?? ""}
          className="pl-8"
          type="search"
          onChange={(e) => handleChange("nombre", e.target.value)}
          placeholder="Buscar por nombre"
        />
      </div>

      {combos.map(({ key, label, items }) => {
        const {
          visible,
          disabled,
          value,
          items: displayItems,
        } = getDisplayState(key, currentFilters, items);

        return (
          visible && (
            <ComboboxFilter
              key={key}
              value={value}
              disabled={disabled}
              items={displayItems ?? items}
              onChange={(val) => handleChange(key, val)}
              placeholder={`Por ${label}`}
            />
          )
        );
      })}
    </div>
  );
}
