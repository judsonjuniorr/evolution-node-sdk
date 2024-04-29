import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  skipNodeModulesBundle: true,
  format: ['cjs', 'esm'],
  dts: true,
})
