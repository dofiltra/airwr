import { defineConfig, loadEnv, Plugin } from 'vite'
import preact from '@preact/preset-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

export default ({ mode }) => {
  return defineConfig({
    plugins: [preact(), tsconfigPaths()],
    build: {
      rollupOptions: {
        plugins: [
          visualizer({
            gzipSize: true,
            brotliSize: true,
          }) as unknown as Plugin,
        ],
      },
    },
  })
}
