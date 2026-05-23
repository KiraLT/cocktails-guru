import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig, fontProviders } from "astro/config";

const ROOT = dirname(fileURLToPath(import.meta.url));
const gitDateCache = new Map<string, string | undefined>();

function gitLastModified(relativePath: string): string | undefined {
	if (gitDateCache.has(relativePath)) return gitDateCache.get(relativePath);
	const absolute = resolve(ROOT, relativePath);
	let result: string | undefined;
	if (existsSync(absolute)) {
		try {
			const out = execSync(
				`git log -1 --format=%cI -- ${JSON.stringify(absolute)}`,
				{
					encoding: "utf8",
					cwd: ROOT,
					stdio: ["ignore", "pipe", "ignore"],
				},
			).trim();
			result = out || undefined;
		} catch {
			result = undefined;
		}
	}
	gitDateCache.set(relativePath, result);
	return result;
}

function lastModForPath(pathname: string): string | undefined {
	const recipeMatch = pathname.match(/^\/recipes\/([^/]+)\/?$/);
	if (recipeMatch) {
		return gitLastModified(`src/content/recipes/${recipeMatch[1]}/data.yaml`);
	}
	const ingredientMatch = pathname.match(/^\/ingredients\/([^/]+)\/?$/);
	if (ingredientMatch) {
		return gitLastModified(
			`src/content/ingredients/${ingredientMatch[1]}/data.yaml`,
		);
	}
	if (pathname === "/" || pathname === "") {
		return gitLastModified("src/pages/index.astro");
	}
	return undefined;
}

export default defineConfig({
	output: "static",
	devToolbar: {
		enabled: false,
	},
	site: process.env.PUBLIC_SITE_URL ?? "https://cocktailsguru.me",
	trailingSlash: "always",
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-inter",
			weights: [400, 500, 600, 700],
			styles: ["normal"],
			subsets: ["latin"],
			display: "swap",
		},
		{
			provider: fontProviders.google(),
			name: "Fraunces",
			cssVariable: "--font-fraunces",
			weights: [400, 600, 700],
			styles: ["normal"],
			subsets: ["latin"],
			display: "swap",
		},
	],
	integrations: [
		react(),
		sitemap({
			filter: (page) =>
				!/\/(list|lists|search|offline)\/?$/.test(new URL(page).pathname),
			serialize(item) {
				const lastmod = lastModForPath(new URL(item.url).pathname);
				if (lastmod) item.lastmod = lastmod;
				return item;
			},
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
					"**/*.{html,js,css,svg,png,jpg,jpeg,webp,avif,ico,woff2,webmanifest}",
				],
				navigateFallback: "/offline/",
				navigateFallbackDenylist: [/^\/(sitemap|robots\.txt)/],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				skipWaiting: true,
				directoryIndex: "index.html",
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
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
