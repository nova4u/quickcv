/// <reference types="vitest/config" />
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [
		tanstackRouter({ autoCodeSplitting: true }),
		// @ts-ignore
		tailwindcss(),
		viteReact(),
		svgr(),
	],
	optimizeDeps: {
		exclude: ["lightningcss-wasm"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					router: ["@tanstack/react-router"],
					form: ["react-hook-form", "@hookform/resolvers", "zod"],
					ui: [
						"@radix-ui/react-accordion",
						"@radix-ui/react-dialog",
						"@radix-ui/react-label",
						"@radix-ui/react-popover",
						"@radix-ui/react-slot",
						"@radix-ui/react-tooltip",
					],
					editor: ["slate", "slate-react", "slate-history"],
					animation: ["motion"],
					utils: ["clsx", "tailwind-merge", "class-variance-authority"],
				},
			},
		},
		// Increase chunk size warning limit since we have legitimate large chunks
		chunkSizeWarningLimit: 1000,
		// Enable source maps for better debugging (optional)
		sourcemap: false,
		// Optimize for smaller builds
		minify: "esbuild",
		target: "esnext",
	},
});
