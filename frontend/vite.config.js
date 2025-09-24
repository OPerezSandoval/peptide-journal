import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Quarkus runs on 8080; Vite dev on 5173
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/q": "http://localhost:8080", // if you want to open /q/openapi, /q/health, etc.
    },
  },
});

