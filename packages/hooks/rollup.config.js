import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { dts } from "rollup-plugin-dts";

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
