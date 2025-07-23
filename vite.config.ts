import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import suidPlugin from "@suid/vite-plugin";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  optimizeDeps: {
    exclude: []
  },
  plugins: [
    nodePolyfills({
      globals: { global: false },
    }),
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
