import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // prevent duplicate React instances
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
  },
});
