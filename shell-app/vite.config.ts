import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/** Repo root — the @exxat/ui library lives one level up from shell-app. */
const libRoot = path.resolve(__dirname, '..')

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Array form (not the object shorthand) because the @exxat/ui entries need
    // regex matching and a guaranteed evaluation order.
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src/app') },

      // --- @exxat/ui, consumed from source -------------------------------
      // The library is not published to a registry we can reach and its dist/
      // is unbuilt, so the shell compiles it straight from TypeScript source.
      // This gives HMR across both codebases and keeps a single React copy.
      // Deep imports (@exxat/ui/<path>) are listed first: Vite matches aliases
      // in order, so the bare-specifier entry must come last or it would
      // swallow them.
      { find: /^@exxat\/ui\/(.*)$/, replacement: path.join(libRoot, 'libs/$1') },
      { find: '@exxat/ui', replacement: path.join(libRoot, 'libs/index.ts') },

      // --- Next.js shims --------------------------------------------------
      // 8 library files are authored against Next. These map them onto
      // react-router / plain DOM equivalents. See src/shims/.
      { find: 'next/link', replacement: path.resolve(__dirname, 'src/shims/next-link.tsx') },
      { find: 'next/navigation', replacement: path.resolve(__dirname, 'src/shims/next-navigation.ts') },
      { find: 'next/image', replacement: path.resolve(__dirname, 'src/shims/next-image.tsx') },

      // --- Single-copy enforcement ----------------------------------------
      // The library's own node_modules carries React 19.2.7; the shell runs
      // 18.3.1. Library source resolves relative to its own location, so
      // without these it would load a second React and every hook would throw
      // "Invalid hook call". Pin every React-identity module to the shell's
      // copy. The library uses no React 19-only APIs, so 18 is safe.
      { find: /^react$/, replacement: path.resolve(__dirname, 'node_modules/react') },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, 'node_modules/react-dom') },
      { find: /^react\/jsx-runtime$/, replacement: path.resolve(__dirname, 'node_modules/react/jsx-runtime') },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime') },
      { find: /^react-dom\/client$/, replacement: path.resolve(__dirname, 'node_modules/react-dom/client') },
    ],
    // Belt and braces for transitive resolutions the alias list can't catch.
    dedupe: ['react', 'react-dom', 'react-router', 'react-hook-form'],
  },
  optimizeDeps: {
    // Source, not a package — must not be pre-bundled as a dependency.
    exclude: ['@exxat/ui'],
  },
  server: {
    fs: {
      // Vite refuses to serve files outside its root by default; the library
      // source and its node_modules both live above shell-app.
      allow: [__dirname, libRoot],
    },
  },
})
