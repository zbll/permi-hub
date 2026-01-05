import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import babel from "vite-plugin-babel";

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "~locale": path.resolve(__dirname, "./app/locale"),
      "~ui": path.resolve(__dirname, "./app/components/ui"),
      "~api": path.resolve(__dirname, "./app/api"),
      "~components": path.resolve(__dirname, "./app/components"),
    },
  },
});
