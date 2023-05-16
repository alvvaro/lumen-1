import react from "@vitejs/plugin-react"
import jotaiDebugLabel from "jotai/babel/plugin-debug-label"
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh"
// import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import aiDevtools from "ai-devtools/babel-plugin"
import inspect from "vite-plugin-inspect"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [aiDevtools, jotaiDebugLabel, jotaiReactRefresh],
      },
    }),
    // visualizer({ filename: "dist/stats.html" }),
    inspect(),
  ],
})
