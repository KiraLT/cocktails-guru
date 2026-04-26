import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	output: "static",
	devToolbar: {
		enabled: false,
	},
	site: process.env.PUBLIC_SITE_URL ?? "https://cocktailsguru.me",
	trailingSlash: "always",
	integrations: [
		react(),
		sitemap({
			filter: (page) =>
				!/\/(list|lists|search)\/?$/.test(new URL(page).pathname),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		build: {
			rollupOptions: {
				onwarn(warning, defaultHandler) {
					if (warning.code === "EMPTY_BUNDLE") {
						return;
					}
					defaultHandler(warning);
				},
			},
		},
	},
});
