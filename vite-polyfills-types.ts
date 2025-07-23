/// <reference types="vite/client" />

declare module 'vite-plugin-node-polyfills' {
    import { Plugin } from 'vite';
    
    interface NodePolyfillsOptions {
      globals?: {
        global?: boolean;
        process?: boolean;
        Buffer?: boolean;
      };
      protocolImports?: boolean;
    }
    
    export function nodePolyfills(options?: NodePolyfillsOptions): Plugin;
  }