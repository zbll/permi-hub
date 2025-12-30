import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import babel from "vite-plugin-babel";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
    babel({ babelConfig: { plugins: ["babel-plugin-react-compiler"] } }),
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
