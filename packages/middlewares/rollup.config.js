import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default defineConfig([
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.js",
      format: "esm",
      name: "middlewares",
      compact: true,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      terser(),
    ],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
]);
