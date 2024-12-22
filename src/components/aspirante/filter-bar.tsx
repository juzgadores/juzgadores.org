"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import v from "voca";

import { objectToComboItems } from "@/lib/utils";
import { judicaturaData as j } from "@/lib/data/judicatura";
import type { AspiranteFilters } from "@/lib/data/aspirantes";
import { ComboboxFilter } from "@/components/combobox-filter";

type OrganoKey = keyof typeof j.organos;
type SalaKey = keyof typeof j.organos.tepjf.salas;
type TituloKey = keyof typeof j.titulos;

type ComboKey = Exclude<keyof AspiranteFilters, "nombre">;

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
const combos = [
  {
    key: "titulo",
    label: "puesto",
    items: objectToComboItems(
      j.titulos,
      ({ singular: { F, M } }) => `${v.capitalize(F)} / ${M}`,
    ),
  },
  {
    key: "organo",
    label: "órgano",
    items: objectToComboItems(j.organos, "nombre"),
  },
  {
    key: "sala",
    label: "sala",
    items: objectToComboItems(j.organos.tepjf.salas, "nombre"),
  },
  {
    key: "entidad",
    label: "estado",
    items: objectToComboItems(j.entidades),
  },
  {
    key: "circuito",
    label: "circuito",
    items: objectToComboItems(j.circuitos, "nombre"),
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
  circuito: [],
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
        value: filters.organo || "",
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
        value: filters.titulo || "",
        items: comboItems,
      };

    case "sala":
      // Only visible if organo === 'tepjf'
      return {
        visible: filters.organo === "tepjf",
        disabled: false,
        value: filters.sala || "",
        items: comboItems,
      };

    case "entidad":
      // If organo === 'tepjf' and the chosen sala has no entidades, hide
      if (filters.organo === "tepjf" && filters.sala) {
        const salaData = j.organos.tepjf.salas[filters.sala as SalaKey];
        if (salaData && salaData.entidades === null) {
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
      // Not visible if organo === 'tepjf'
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

/**
 * Main filter bar component for aspirantes.
 */
export function AspiranteFilterBar({
  filters,
}: Readonly<{ filters: AspiranteFilters }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Compute current filters from the URL + the defaults passed in `filters`.
  const currentFilters = useMemo(() => {
    const record: Record<ComboKey, string> = {
      organo: "",
      titulo: "",
      sala: "",
      entidad: "",
      circuito: "",
    };
    combos.forEach((combo) => {
      record[combo.key] =
        searchParams.get(combo.key) ?? filters[combo.key] ?? "";
    });
    return record;
  }, [searchParams, filters]);

  // When a filter changes, update URL params and clear dependent filters.
  const handleChange = useCallback(
    (key: ComboKey, newValue: string) => {
      const params = new URLSearchParams(searchParams);

      // Clear dependent filters first (defined in `dependencies`)
      const dependents = dependencies[key];
      dependents.forEach((dep) => params.delete(dep));

      // Then update this filter in the URL
      if (newValue) {
        params.set(key, newValue);
      } else {
        params.delete(key);
      }

      // Push updated params to the router
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {combos.map(({ key, label, items }) => {
        // Determine if this combo is visible, disabled, and what value it should show
        const {
          visible,
          disabled,
          value,
          items: displayItems,
        } = getDisplayState(key, currentFilters, items);
        if (!visible) return null;

        return (
          <ComboboxFilter
            key={key}
            value={value}
            disabled={disabled}
            items={displayItems ?? items}
            onChange={(val) => handleChange(key, val)}
            placeholder={`Filtrar por ${label}`}
          />
        );
      })}
    </div>
  );
}
