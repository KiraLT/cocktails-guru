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
	keywords: string[];
	excludeKeywords?: string[];
	requireNoBaseSpirit?: boolean;
}

const BASE_SPIRITS = ["rum", "gin", "vodka", "tequila", "whiskey", "bourbon"];

export const SPIRITS: SpiritDefinition[] = [
	{
		slug: "tequila",
		name: "Tequila",
		tagline: "Agave-driven margaritas, palomas, and mules.",
		description:
			"Cocktails built on silver tequila — bright, citrus-forward, and unmistakably agave.",
		keywords: ["tequila"],
	},
	{
		slug: "rum",
		name: "Rum",
		tagline: "Sugar-cane classics from daiquiri to mai tai.",
		description:
			"Recipes featuring white, dark, spiced, or coconut rum — the backbone of tiki and Caribbean drinks.",
		keywords: ["rum"],
	},
	{
		slug: "gin",
		name: "Gin",
		tagline: "Botanical, bittersweet, and herbaceous.",
		description:
			"Gin-based cocktails — from gin & tonic crispness to Negroni bittersweetness.",
		keywords: ["gin"],
		excludeKeywords: ["ginger"],
	},
	{
		slug: "vodka",
		name: "Vodka",
		tagline: "Clean, neutral, and endlessly mixable.",
		description: "Vodka-based recipes — from espresso martinis to mules.",
		keywords: ["vodka"],
	},
	{
		slug: "whiskey",
		name: "Whiskey",
		tagline: "Bourbon and rye in classic form.",
		description:
			"Whiskey, bourbon, and rye cocktails — old-fashioned territory.",
		keywords: ["whiskey", "whisky", "bourbon", "rye"],
	},
	{
		slug: "aperitif",
		name: "Aperitif",
		tagline: "Bittersweet sippers built around Aperol, Campari, and amari.",
		description:
			"Aperitivo-style cocktails featuring bittersweet liqueurs like Aperol, Campari, amaretto, or Midori.",
		keywords: [
			"aperol",
			"campari",
			"amaretto",
			"midori",
			"cointreau",
			"prosecco",
		],
		requireNoBaseSpirit: true,
	},
];

const wordBoundaryMatch = (haystack: string, needle: string): boolean =>
	new RegExp(`\\b${needle}\\b`).test(haystack);

const matchesSpirit = (
	ingredients: string[],
	spirit: SpiritDefinition,
): boolean => {
	const joined = ingredients.join(" ");
	const hasKeyword = spirit.keywords.some((k) => wordBoundaryMatch(joined, k));
	if (!hasKeyword) return false;
	if (spirit.excludeKeywords?.some((k) => joined.includes(k))) return false;
	if (
		spirit.requireNoBaseSpirit &&
		BASE_SPIRITS.some((k) => wordBoundaryMatch(joined, k))
	) {
		return false;
	}
	return true;
};

export const recipeSpirits = (recipe: Recipe): Spirit[] => {
	const ingredients = Object.keys(recipe.data.ingredients ?? {}).map((i) =>
		i.toLowerCase(),
	);
	return SPIRITS.filter((spirit) => matchesSpirit(ingredients, spirit)).map(
		(s) => s.slug,
	);
};

export const recipesBySpirit = (recipes: Recipe[], spirit: Spirit): Recipe[] =>
	recipes.filter((recipe) => recipeSpirits(recipe).includes(spirit));
