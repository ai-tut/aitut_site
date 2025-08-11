import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeRaw]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../..'),
    },
  },
})
