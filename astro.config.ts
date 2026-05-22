import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
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
				!/\/(list|lists|search|offline)\/?$/.test(new URL(page).pathname),
		}),
		AstroPWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			includeAssets: [
				"favicon.ico",
				"favicon.svg",
				"favicon-96x96.png",
				"apple-touch-icon.png",
				"robots.txt",
			],
			manifest: {
				name: "Cocktails Guru",
				short_name: "Cocktails",
				description: "Curated cocktail recipes — works fully offline.",
				start_url: "/",
				scope: "/",
				display: "standalone",
				orientation: "portrait",
				theme_color: "#0d1117",
				background_color: "#0d1117",
				icons: [
					{
						src: "/web-app-manifest-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/web-app-manifest-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
				shortcuts: [
					{
						name: "Search cocktails",
						url: "/search/",
						description: "Search the recipe catalogue",
					},
					{
						name: "My lists",
						url: "/lists/",
						description: "Open your saved cocktail lists",
					},
				],
			},
			workbox: {
				globPatterns: [
					"**/*.{html,js,css,svg,jpg,jpeg,webp,avif,ico,woff2,webmanifest}",
					"apple-touch-icon.png",
					"favicon-*.png",
					"web-app-manifest-*.png",
				],
				globIgnores: ["**/_astro/*.png"],
				navigateFallback: "/offline/",
				navigateFallbackDenylist: [/^\/(sitemap|robots\.txt)/],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				skipWaiting: true,
				directoryIndex: "index.html",
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "google-fonts-stylesheets",
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-webfonts",
							cacheableResponse: { statuses: [0, 200] },
							expiration: {
								maxEntries: 30,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
						},
					},
				],
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
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
