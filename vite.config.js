import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) {
              return "firebase"
            }

            if (id.includes("react-router-dom")) {
              return "router"
            }

            if (id.includes("react") || id.includes("react-dom")) {
              return "react"
            }

            if (id.includes("lucide-react")) {
              return "icons"
            }

            if (id.includes("framer-motion")) {
              return "animations"
            }

            if (id.includes("react-simple-typewriter")) {
              return "typewriter"
            }

            return "vendor"
          }
        },
      },
    },
  },
})