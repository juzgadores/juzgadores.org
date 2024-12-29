import React from "react";

// import userEvent from "@testing-library/user-event";
import { waitFor, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { mockAllIsIntersecting } from "@/test-utils/mockIntersectionObserver";
import { Aspirante } from "@/lib/data/aspirantes";

import { AspiranteGridList } from "./aspirante-grid-list";
// ^ Example helper to simulate the intersection observer.
//   You can implement your own or use an existing library.

describe("AspiranteGridList", () => {
  const mockFetchMoreAspirantes = jest.fn();

  const initialAspirantes: Aspirante[] = [
    {
      slug: "aspirante-1",
      nombre: "Aspirante One",
      organo: {
        nombre: "Organo One",
        conector: "de",
        // Add other required properties
      },
      // Add other required properties
    },
    {
      slug: "aspirante-2",
      nombre: "Aspirante Two",
      organo: {
        nombre: "Organo Two",
        conector: "de",
        // Add other required properties
      },
      // Add other required properties
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the initial aspirantes", () => {
    render(
      <AspiranteGridList
        filters={{}}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={mockFetchMoreAspirantes}
      />,
    );

    // Check that each aspirante's name (or slug) is visible
    expect(screen.getByText("Aspirante One")).toBeInTheDocument();
    expect(screen.getByText("Aspirante Two")).toBeInTheDocument();
  });

  it("fetches more aspirantes when the sentinel div becomes visible (inView)", async () => {
    // Provide a set of new aspirantes for mocking
    const newAspirantes: Aspirante[] = [
      { slug: "aspirante-3", name: "Aspirante Three" },
      { slug: "aspirante-4", name: "Aspirante Four" },
    ] as unknown as Aspirante[];

    mockFetchMoreAspirantes.mockResolvedValue(newAspirantes);

    render(
      <AspiranteGridList
        filters={{}}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={mockFetchMoreAspirantes}
      />,
    );

    // The sentinel div is rendered at the bottom of the list
    const sentinelDiv = screen.getByTestId("aspirante-sentinel");
    expect(sentinelDiv).toBeInTheDocument();

    // Simulate the intersection observer so that the sentinel is 'in view'
    mockAllIsIntersecting(true);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(mockFetchMoreAspirantes).toHaveBeenCalledTimes(1);
    });

    // Now the new aspirantes should appear
    expect(screen.getByText("Aspirante Three")).toBeInTheDocument();
    expect(screen.getByText("Aspirante Four")).toBeInTheDocument();
  });

  it("merges and deduplicates aspirantes when fetching more", async () => {
    // Provide a set of overlapping aspirantes (one duplicate: aspirante-2)
    const overlappingAspirantes: Aspirante[] = [
      { slug: "aspirante-2", name: "Aspirante Two - Duplicate" },
      { slug: "aspirante-5", name: "Aspirante Five" },
    ] as unknown as Aspirante[];

    mockFetchMoreAspirantes.mockResolvedValue(overlappingAspirantes);

    render(
      <AspiranteGridList
        filters={{}}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={mockFetchMoreAspirantes}
      />,
    );

    // Trigger inView
    mockAllIsIntersecting(true);

    await waitFor(() => {
      expect(mockFetchMoreAspirantes).toHaveBeenCalledTimes(1);
    });

    // Expect new and old aspirantes, but "aspirante-2" should not duplicate
    expect(
      screen.queryByText("Aspirante Two - Duplicate"),
    ).not.toBeInTheDocument();

    // The newly added aspirante "aspirante-5" should be there
    expect(screen.getByText("Aspirante Five")).toBeInTheDocument();
  });

  it("does not fetch if already loading", async () => {
    // Make the mock fetch slow so we can simulate "isLoading = true"
    mockFetchMoreAspirantes.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 2000)),
    );

    render(
      <AspiranteGridList
        filters={{}}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={mockFetchMoreAspirantes}
      />,
    );

    // First intersection triggers loading
    mockAllIsIntersecting(true);
    await waitFor(() => {
      expect(mockFetchMoreAspirantes).toHaveBeenCalledTimes(1);
    });

    // While still loading, trigger intersection again
    mockAllIsIntersecting(true);
    // fetchMore should not be called again
    expect(mockFetchMoreAspirantes).toHaveBeenCalledTimes(1);
  });

  it("does not fetch if hasMore is false", async () => {
    // Return fewer items than ITEMS_PER_PAGE so hasMore = false
    mockFetchMoreAspirantes.mockResolvedValue([
      { slug: "aspirante-6", name: "Aspirante Six" },
    ] as unknown as Aspirante[]);

    render(
      <AspiranteGridList
        filters={{}}
        initialAspirantes={initialAspirantes}
        fetchMoreAspirantes={mockFetchMoreAspirantes}
      />,
    );

    // Trigger first intersection
    mockAllIsIntersecting(true);
    await waitFor(() => {
      expect(mockFetchMoreAspirantes).toHaveBeenCalledTimes(1);
    });

    // Trigger intersection again, hasMore should be false now
    mockAllIsIntersecting(true);
    // No additional fetch
    expect(mockFetchMoreAspirantes).toHaveBeenCalledTimes(1);
  });
});
