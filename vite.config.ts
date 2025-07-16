import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import suidPlugin from "@suid/vite-plugin";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      "@syntect/wasm"
    ]
  },
  plugins: [
    nodePolyfills({
      globals: {
        global: true, // This polyfills the global object
      },
    }),
    wasm(), 
    topLevelAwait(), 
    suidPlugin(), 
    solidPlugin()
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
