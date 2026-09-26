import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // The example imports the library source from the parent directory, which has
    // its own node_modules. Force both projects to share the example's React
    // runtime so hooks always use the same dispatcher.
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
})
