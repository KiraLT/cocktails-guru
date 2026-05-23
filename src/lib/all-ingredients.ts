import { titleCase } from "common-stuff";
import { getAllIngredients } from "@/lib/ingredients-data";
import { ingredientSlug } from "@/lib/ingredients-utils";
import { getAllRecipes } from "@/lib/recipes-data";
import type { Ingredient, Recipe } from "@/types/content";

export type IngredientStub = {
	slug: string;
	name: string;
	full?: Ingredient;
	recipes: Recipe[];
};

export function ingredientDisplayName(slug: string): string {
	return titleCase(slug.split("-").join(" "));
}

export async function getAllIngredientStubs(): Promise<IngredientStub[]> {
	const [yamlIngredients, recipes] = await Promise.all([
		getAllIngredients(),
		getAllRecipes(),
	]);

	const byYamlSlug = new Map(yamlIngredients.map((i) => [i.slug, i]));
	const bySlug = new Map<string, IngredientStub>();

	for (const ingredient of yamlIngredients) {
		bySlug.set(ingredient.slug, {
			slug: ingredient.slug,
			name: ingredient.data.name,
			full: ingredient,
			recipes: [],
		});
	}

	for (const recipe of recipes) {
		for (const rawName of Object.keys(recipe.data.ingredients ?? {})) {
			const slug = ingredientSlug(rawName);
			if (!slug) continue;
			let stub = bySlug.get(slug);
			if (!stub) {
				const full = byYamlSlug.get(slug);
				stub = {
					slug,
					name: full?.data.name ?? ingredientDisplayName(slug),
					full,
					recipes: [],
				};
				bySlug.set(slug, stub);
			}
			if (!stub.recipes.some((r) => r.slug === recipe.slug)) {
				stub.recipes.push(recipe);
			}
		}
	}

	return Array.from(bySlug.values()).sort((a, b) =>
		a.name.localeCompare(b.name),
	);
}

export async function getIngredientStubBySlug(
	slug: string,
): Promise<IngredientStub | undefined> {
	const all = await getAllIngredientStubs();
	return all.find((entry) => entry.slug === slug);
}
