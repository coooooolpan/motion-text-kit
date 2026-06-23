import { copyFileSync, mkdirSync } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/motion-text-kit/index.ts"],
  external: ["react", "react/jsx-runtime"],
  format: ["esm", "cjs"],
  minify: false,
  onSuccess: async () => {
    mkdirSync("dist", { recursive: true });
    copyFileSync("src/motion-text-kit/styles.css", "dist/styles.css");
  },
  outDir: "dist",
  outExtension: ({ format }) => ({
    js: format === "esm" ? ".mjs" : ".cjs",
  }),
  sourcemap: true,
  splitting: false,
  target: "es2019",
  tsconfig: "tsconfig.package.json",
});
