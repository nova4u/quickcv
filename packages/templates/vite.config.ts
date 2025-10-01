/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { templatesPlugin } from "./src/vite-plugin-templates";

export default defineConfig({
	plugins: [react(), tailwindcss(), templatesPlugin()],
	test: {
		projects: [
			{
				test: {
					include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
					exclude: ["**/*.browser.{test,spec}.{js,ts,jsx,tsx}"],
					name: "unit",
					environment: "jsdom",
					globals: true,
					css: true,
				},
			},
			{
				test: {
					include: ["**/*.browser.{test,spec}.{js,ts,jsx,tsx}"],
					name: "browser",
					browser: {
						headless: true,
						enabled: true,
						provider: "playwright",
						instances: [{ browser: "chromium" }],
						screenshotFailures: false,
					},
				},
				optimizeDeps: {
					exclude: ["lightningcss-wasm"],
				},
			},
		],
	},
});
