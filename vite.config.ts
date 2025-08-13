import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/terra-clicker/", // Sostituisci 'terra-clicker' con il nome del tuo repository GitHub
})
