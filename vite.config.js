/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // EUI v116 uses Emotion CSS-in-JS internally. Force Vite to pre-bundle
        // these together so they share a single module instance — and therefore
        // a single Emotion cache/context — rather than splitting across the
        // pre-bundled and raw-ESM graphs.
        include: [
            "@elastic/eui",
            "@elastic/eui-theme-borealis",
            "@emotion/react",
            "@emotion/css",
            "@emotion/styled",
        ],
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.js"],
    },
});
