import "@testing-library/jest-dom/vitest";

// jsdom implements neither ResizeObserver, IntersectionObserver, nor
// matchMedia. EUI components touch the first during render/layout; the
// timeline page's react-intersection-observer usage touches the second.
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock;

class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.IntersectionObserver = IntersectionObserverMock;

// Root calls window.gtag unconditionally on every route change.
window.gtag = () => {};

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});
