import { describe, expect, test } from "@jest/globals";

import {
  getAspiranteBySlug,
  AspiranteFilters,
  getAspirantes,
} from "@/lib/data/aspirantes";

describe("aspirantes.ts", () => {
  test("getAspirantes() returns an array of Aspirantes without filters", () => {
    const result = getAspirantes();
    expect(Array.isArray(result)).toBe(true);
    // If you want to check that there is at least one aspirante
    expect(result.length).toBeGreaterThan(0);

    // Check that the items conform to your Aspirante shape
    const sample = result[0];
    expect(sample).toHaveProperty("nombre");
    expect(sample).toHaveProperty("genero");
    expect(sample).toHaveProperty("organoSlug");
    expect(sample).toHaveProperty("slug");
    // etc...
  });

  test("getAspirantes() respects filters - organo", () => {
    // Suppose you know "scjn" is definitely in your data:
    const filters: AspiranteFilters = { organo: "scjn" };

    const result = getAspirantes(filters);

    // All returned aspirantes must have organoSlug === "scjn"
    const allScjn = result.every((asp) => asp.organoSlug === "scjn");
    expect(allScjn).toBe(true);

    // If "scjn" is rare, maybe we expect only a few:
    // expect(result).toHaveLength(5);
    // (Adjust based on your actual data)
  });

  test("getAspirantes() can filter by circuito and sala together", () => {
    // Hypothetical filter
    const filters: AspiranteFilters = { circuito: "Primero", sala: "superior" };

    const result = getAspirantes(filters);
    expect(result).toBeInstanceOf(Array);

    // Check that each result meets the criteria
    for (const asp of result) {
      expect(asp.circuito).toBe("Primero");
      expect(asp.salaSlug).toBe("superior");
    }
  });

  test("getAspirantes() partial name search", () => {
    // If someone is named "Rodríguez", searching "rodr" might match
    const filters: AspiranteFilters = { nombre: "rodr" };
    const result = getAspirantes(filters);
    for (const asp of result) {
      expect(asp.nombre.toLowerCase()).toMatch(/rodr/);
    }
  });

  test("getAspiranteBySlug() returns correct aspirante or null if not found", () => {
    // 1) We can pick a known existing aspirante
    // For a real test, you'd look at your actual aspirantes.json to find a known name
    // e.g. "Maria del Carmen" -> slug might be "maria-del-carmen"
    // If you do not have a known example, skip or dynamically get one from getAspirantes()

    const all = getAspirantes();
    const known = all[0]; // take any known aspirante
    const found = getAspiranteBySlug(known.slug);
    expect(found).not.toBeNull();
    expect(found?.slug).toBe(known.slug);

    // 2) A non-existing slug
    const notFound = getAspiranteBySlug("this-slug-does-not-exist");
    expect(notFound).toBeNull();
  });

  test("Pagination in getAspirantes()", () => {
    // We want offset=0, limit=5
    const resultPage1 = getAspirantes({ offset: 0, limit: 5 });
    expect(resultPage1).toHaveLength(5);

    // Another page, offset=5, limit=5
    const resultPage2 = getAspirantes({ offset: 5, limit: 5 });
    expect(resultPage2).toHaveLength(5);

    // Expect that the sets do not overlap (assuming the data has >10 items)
    const slugsPage1 = resultPage1.map((a) => a.slug);
    const slugsPage2 = resultPage2.map((a) => a.slug);

    const overlap = slugsPage1.filter((slug) => slugsPage2.includes(slug));
    expect(overlap).toHaveLength(0);
  });
});
