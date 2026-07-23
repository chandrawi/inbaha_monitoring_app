import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  ssr: false, // Disables server-side rendering completely
  server: {
    preset: "static" // Forces a static, client-side only build output
  }
});
