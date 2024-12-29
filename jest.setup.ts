import "@testing-library/jest-dom";

// A minimal IntersectionObserver mock:
beforeAll(() => {
  (global as any).IntersectionObserver = class {
    callback: (entries: any[]) => void;
    target!: Element;

    constructor(callback: (entries: any[]) => void) {
      this.callback = callback;
      (global as any).__INTERSECTION_OBSERVERS__ =
        (global as any).__INTERSECTION_OBSERVERS__ || [];
      (global as any).__INTERSECTION_OBSERVERS__.push(this);
    }

    observe(target: Element) {
      this.target = target;
    }
    unobserve() {
      // no-op
    }
    disconnect() {
      // no-op
    }
  };
});
