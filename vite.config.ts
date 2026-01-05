import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(), // CSSをJavaScriptに自動注入
    wasm(),
    topLevelAwait(),
  ],
  optimizeDeps: {
    exclude: ['chamber-abc'],
  },
  build: {
    emptyOutDir: false, // tscで生成した型定義を保持
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'AbcEditor',
      formats: ['es'],
      fileName: () => `abc-editor.es.js`,
    },
    rollupOptions: {
      // React, React-DOM, abcjs, chamber-abcを外部依存として扱う
      external: ['react', 'react-dom', 'react/jsx-runtime', 'abcjs', 'chamber-abc'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          abcjs: 'ABCJS',
        },
      },
    },
  },
})
