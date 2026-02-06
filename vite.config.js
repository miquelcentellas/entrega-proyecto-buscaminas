import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/entrega-proyecto-buscaminas/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
