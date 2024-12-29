/**
 * @file aspirantes.test.ts
 * @description Unit tests for aspirantes.ts with updated signatures
 */

import { describe, expect, it } from "@jest/globals";

import {
  AspiranteQueryParams,
  getAspiranteBySlug,
  getAspirantes,
} from "@/lib/data/aspirantes";

describe("aspirantes.ts", () => {
  describe("getAspirantes()", () => {
    it("returns an array of Aspirantes with default pagination (no specific filters)", async () => {
      // Provide the minimal required params for the TS type, letting
      // offset=0 and limit=12 act as “no filters” except pagination defaults.
      const query: AspiranteQueryParams = { offset: 0, limit: 12 };
      const result = await getAspirantes(query);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Check shape of a sample
      const sample = result[0];
      expect(sample).toHaveProperty("nombre");
      expect(sample).toHaveProperty("genero");
      expect(sample).toHaveProperty("organoSlug");
      expect(sample).toHaveProperty("slug");
      expect(sample).toHaveProperty("cargo");
    });

    it("respects organo filter (e.g., 'scjn')", async () => {
      // Must include offset & limit
      const query: AspiranteQueryParams = {
        offset: 0,
        limit: 12,
        organo: "scjn",
      };
      const result = await getAspirantes(query);

      expect(result.length).toBeGreaterThan(0);
      for (const asp of result) {
        expect(asp.organoSlug).toBe("scjn");
      }
    });

    it("can filter by both circuito and sala", async () => {
      const query: AspiranteQueryParams = {
        offset: 0,
        limit: 50,
        circuito: "Primero",
        sala: "superior",
      };
      const result = await getAspirantes(query);

      // All results should match both circuit and sala
      for (const asp of result) {
        expect(asp.circuitoSlug).toBe("Primero");
        expect(asp.salaSlug).toBe("superior");
      }
    });

    it("filters by partial name match (case-insensitive)", async () => {
      // Searching "rodr" might find "Rodríguez"
      const query: AspiranteQueryParams = {
        offset: 0,
        limit: 100,
        nombre: "rodr",
      };
      const result = await getAspirantes(query);

      for (const asp of result) {
        expect(asp.nombre.toLowerCase()).toMatch(/rodr/);
      }
    });

    it("supports pagination: offset and limit", async () => {
      // Page 1: offset=0, limit=5
      const page1 = await getAspirantes({ offset: 0, limit: 5 });
      expect(page1).toHaveLength(5);

      // Page 2: offset=5, limit=5
      const page2 = await getAspirantes({ offset: 5, limit: 5 });
      expect(page2).toHaveLength(5);

      // Check that page1 and page2 do not overlap (assuming data has >10 items)
      const slugsPage1 = page1.map((a) => a.slug);
      const slugsPage2 = page2.map((a) => a.slug);
      const overlap = slugsPage1.filter((slug) => slugsPage2.includes(slug));
      expect(overlap).toHaveLength(0);
    });
  });

  describe("getAspiranteBySlug()", () => {
    it("returns the correct aspirante for a known slug", async () => {
      // 1) Grab a known aspirante from the data
      const all = await getAspirantes({ offset: 0, limit: 12 });
      const known = all[0];
      const found = getAspiranteBySlug(known.slug);

      expect(found).not.toBeNull();
      expect(found?.slug).toBe(known.slug);
    });

    it("returns null for a non-existing slug", () => {
      // 2) Pass in some made-up slug
      const notFound = getAspiranteBySlug("this-slug-does-not-exist");
      expect(notFound).toBeNull();
    });
  });
});
