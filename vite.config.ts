import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 10000,  
    host: '0.0.0.0',
  },
  define: {
    'process.env': {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    },
  },
});