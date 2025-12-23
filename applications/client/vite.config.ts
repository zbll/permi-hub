import { reactRouter } from "@react-router/dev/vite";
import { tailwindcssConfig } from "@packages/tailwind-config";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcssConfig(), reactRouter(), tsconfigPaths()],
});
