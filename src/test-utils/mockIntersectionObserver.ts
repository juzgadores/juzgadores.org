import { act } from "@testing-library/react";

/**
 * This method calls the IntersectionObserver callback with `isIntersecting = true` or false
 * for all currently tracked elements. This effectively simulates the element
 * entering or leaving the viewport.
 *
 * You need a global mock for IntersectionObserver (usually set up in your jest.setup.js/ts).
 */
export function mockAllIsIntersecting(isIntersecting: boolean): void {
  // Access the global IntersectionObserver mock references
  // This depends on how you've set up your global mock in jest.setup
  const observers = (global as any).__INTERSECTION_OBSERVERS__ || [];

  for (const observer of observers) {
    act(() => {
      observer.callback([
        {
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          target: observer.target,
          // If needed, you can add more IntersectionObserverEntry fields here
        },
      ]);
    });
  }
}
