import { jest } from "@jest/globals";

import { getAspirantes } from "./aspirantes";

// Mock data
const mockAspirantesData = [
  {
    organo: "scjn",
    nombre: "Ana María Ibarra Olguín",
    genero: "Femenino",
    expediente: "26/2024",
    sala: "superior",
    circuito: "Primero",
  },
  {
    organo: "tepjf",
    nombre: "Adriana Margarita Favela Herrera",
    genero: "Femenino",
    expediente: "9/2024",
    sala: "superior",
    circuito: "Segundo",
  },
];

const mockJudicaturaData = {
  circuitos: [
    { nombre: "Primero", entidad: "Ciudad de México", organos: [] },
    { nombre: "Segundo", entidad: "Estado de México", organos: [] },
  ],
  organos: {
    scjn: {
      nombre: "Suprema Corte de Justicia de la Nación",
      titulo: "ministro",
    },
    tepjf: {
      nombre: "Tribunal Electoral del Poder Judicial de la Federación",
      titulo: "magistrado",
      salas: {
        superior: { entidades: null },
        guadalajara: { entidades: ["Guadalajara", "Zacatecas"] },
        xalapa: { entidades: ["Veracruz", "Puebla"] },
      },
    },
    "juzgados-distrito": {
      nombre: "Juzgados de Distrito",
      titulo: "juez",
      materias: ["procesos-penales-federales", "amparo-penal"],
    },
  },
};

jest.mock("./aspirantes.json", () => ({
  __esModule: true,
  default: mockAspirantesData,
}));

jest.mock("./judicatura.json", () => ({
  __esModule: true,
  default: mockJudicaturaData,
}));

describe("getAspirantes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all aspirantes when no filters are applied", async () => {
    const result = await getAspirantes();
    expect(result).toHaveLength(2);
  });

  it("should filter aspirantes by entidad", async () => {
    const result = await getAspirantes({ entidad: "Ciudad de México" });
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe("Ana María Ibarra Olguín");
  });

  it("should filter aspirantes by titulo", async () => {
    const result = await getAspirantes({ titulo: "magistrado" });
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe("Adriana Margarita Favela Herrera");
  });

  it("should filter aspirantes by sala", async () => {
    const result = await getAspirantes({ sala: "superior" });
    expect(result).toHaveLength(2);
  });

  it("should filter aspirantes by organo", async () => {
    const result = await getAspirantes({ organo: "scjn" });
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe("Ana María Ibarra Olguín");
  });

  it("should return an empty array if no aspirantes match the filters", async () => {
    const result = await getAspirantes({ entidad: "Nonexistent" });
    expect(result).toHaveLength(0);
  });
});
