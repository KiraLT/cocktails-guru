import { titleCase } from "common-stuff";
import type { Ingredient, Recipe } from "@/types/content";

const SITE_NAME = "Cocktails Guru";
const SITE_TAGLINE = "Curated cocktail recipes for home mixology.";
const DEFAULT_PUBLISHED = "2024-01-01";

export function siteName(): string {
	return SITE_NAME;
}

export function cleanText(text: string | undefined): string {
	return (text ?? "").replace(/\s+/g, " ").trim();
}

export function truncateDescription(
	text: string | undefined,
	max = 155,
): string {
	const cleaned = cleanText(text);
	if (cleaned.length <= max) return cleaned;
	const slice = cleaned.slice(0, max - 1);
	const lastSpace = slice.lastIndexOf(" ");
	const stem =
		lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice.trimEnd();
	return `${stem.replace(/[.,;:!?\-—]+$/, "")}…`;
}

export function isoDuration(minutes: number | undefined): string | undefined {
	if (!minutes || minutes <= 0) return undefined;
	return `PT${Math.round(minutes)}M`;
}

export function recipeKeywords(recipe: Recipe): string {
	const tokens = new Set<string>();
	tokens.add(recipe.data.name.toLowerCase());
	tokens.add("cocktail");
	tokens.add("cocktail recipe");
	if (recipe.data.cuisine) {
		tokens.add(`${recipe.data.cuisine.toLowerCase()} cocktail`);
	}
	for (const ingredient of Object.keys(recipe.data.ingredients ?? {})) {
		tokens.add(ingredient.split("-").join(" "));
	}
	for (const k of recipe.data.keywords ?? []) {
		tokens.add(k.toLowerCase());
	}
	return Array.from(tokens).join(", ");
}

export function authorOrgJsonLd(siteUrl: string) {
	return {
		"@type": "Organization",
		name: SITE_NAME,
		url: siteUrl,
		logo: new URL("/web-app-manifest-512x512.png", siteUrl).toString(),
	};
}

export function organizationJsonLd(siteUrl: string) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SITE_NAME,
		alternateName: "Cocktails",
		description: SITE_TAGLINE,
		url: siteUrl,
		logo: new URL("/web-app-manifest-512x512.png", siteUrl).toString(),
		sameAs: ["https://github.com/KiraLT/cocktails-guru"],
	};
}

export function breadcrumbJsonLd(
	items: { name: string; url: string }[],
	siteUrl: string,
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: new URL(item.url, siteUrl).toString(),
		})),
	};
}

export function recipeJsonLd(
	recipe: Recipe,
	opts: { siteUrl: string; canonicalUrl: string; imageUrls: string[] },
) {
	const { siteUrl, canonicalUrl, imageUrls } = opts;
	const cleanDescription = cleanText(recipe.data.description);
	const prepTime = isoDuration(recipe.data.prepTimeMinutes ?? 4);

	const instructions = recipe.data.instructions.map((text, index) => ({
		"@type": "HowToStep",
		name: `Step ${index + 1}`,
		text,
		position: index + 1,
	}));

	const ingredients = Object.entries(recipe.data.ingredients).map(
		([ingredient, quantity]) =>
			`${quantity} ${titleCase(ingredient.split("-").join(" "))}`,
	);

	return {
		"@context": "https://schema.org",
		"@type": "Recipe",
		name: recipe.data.name,
		description: cleanDescription,
		image: imageUrls,
		recipeIngredient: ingredients,
		recipeInstructions: instructions,
		recipeCategory: "Cocktail",
		recipeCuisine: recipe.data.cuisine,
		recipeYield: recipe.data.servingYield ?? "1 cocktail",
		prepTime,
		totalTime: prepTime,
		cookTime: "PT0M",
		keywords: recipeKeywords(recipe),
		datePublished: recipe.data.published ?? DEFAULT_PUBLISHED,
		author: authorOrgJsonLd(siteUrl),
		publisher: authorOrgJsonLd(siteUrl),
		mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
		suitableForDiet: undefined,
	};
}

export function ingredientArticleJsonLd(
	ingredient: Ingredient,
	opts: { siteUrl: string; canonicalUrl: string; imageUrl: string },
) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: `${ingredient.data.name} — Cocktail Ingredient`,
		description: cleanText(ingredient.data.description),
		image: opts.imageUrl,
		mainEntityOfPage: { "@type": "WebPage", "@id": opts.canonicalUrl },
		author: authorOrgJsonLd(opts.siteUrl),
		publisher: authorOrgJsonLd(opts.siteUrl),
		about: {
			"@type": "Thing",
			name: ingredient.data.name,
		},
	};
}
