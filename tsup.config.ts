import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  treeshake: true,
  target: 'es2020',
  entry: ['src/index.ts'],
  minify: true,

  dts: true,
  format: ['cjs', 'esm', 'iife'],
})
