import type { Recipe } from "@/types/content";

export type Spirit =
	| "tequila"
	| "rum"
	| "gin"
	| "vodka"
	| "whiskey"
	| "aperitif";

export interface SpiritDefinition {
	slug: Spirit;
	name: string;
	tagline: string;
	description: string;
	match: (ingredients: string[]) => boolean;
}

const has = (ingredients: string[], pattern: RegExp): boolean =>
	ingredients.some((ing) => pattern.test(ing));

export const SPIRITS: SpiritDefinition[] = [
	{
		slug: "tequila",
		name: "Tequila",
		tagline: "Agave-driven margaritas, palomas, and mules.",
		description:
			"Cocktails built on silver tequila — bright, citrus-forward, and unmistakably agave.",
		match: (ings) => has(ings, /\btequila\b/),
	},
	{
		slug: "rum",
		name: "Rum",
		tagline: "Sugar-cane classics from daiquiri to mai tai.",
		description:
			"Recipes featuring white, dark, spiced, or coconut rum — the backbone of tiki and Caribbean drinks.",
		match: (ings) => has(ings, /\brum\b/),
	},
	{
		slug: "gin",
		name: "Gin",
		tagline: "Botanical, bittersweet, and herbaceous.",
		description:
			"Gin-based cocktails — from gin & tonic crispness to Negroni bittersweetness.",
		match: (ings) => has(ings, /(^|\s)gin($|\s)/) && !has(ings, /ginger/),
	},
	{
		slug: "vodka",
		name: "Vodka",
		tagline: "Clean, neutral, and endlessly mixable.",
		description: "Vodka-based recipes — from espresso martinis to mules.",
		match: (ings) => has(ings, /\bvodka\b/),
	},
	{
		slug: "whiskey",
		name: "Whiskey",
		tagline: "Bourbon and rye in classic form.",
		description:
			"Whiskey, bourbon, and rye cocktails — old-fashioned territory.",
		match: (ings) => has(ings, /\b(whiskey|whisky|bourbon|rye)\b/),
	},
	{
		slug: "aperitif",
		name: "Aperitif",
		tagline: "Bittersweet sippers built around Aperol, Campari, and amari.",
		description:
			"Aperitivo-style cocktails featuring bittersweet liqueurs like Aperol, Campari, amaretto, or Midori.",
		match: (ings) =>
			has(ings, /\b(aperol|campari|amaretto|midori|cointreau|prosecco)\b/) &&
			!has(ings, /\b(rum|gin|vodka|tequila|whiskey|bourbon)\b/),
	},
];

export function recipeSpirits(recipe: Recipe): Spirit[] {
	const ings = Object.keys(recipe.data.ingredients ?? {}).map((i) =>
		i.toLowerCase(),
	);
	return SPIRITS.filter((spirit) => spirit.match(ings)).map((s) => s.slug);
}

export function recipesBySpirit(recipes: Recipe[], spirit: Spirit): Recipe[] {
	return recipes.filter((recipe) => recipeSpirits(recipe).includes(spirit));
}
