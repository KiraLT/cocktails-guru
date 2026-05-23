import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import type { Recipe } from "@/types/content";

const recipeImages = import.meta.glob<{ default: ImageMetadata }>(
	"../content/recipes/**/image.jpg",
	{ eager: true },
);

function resolveRecipeImage(slug: string): ImageMetadata | undefined {
	const match = Object.entries(recipeImages).find(([path]) =>
		path.endsWith(`/recipes/${slug}/image.jpg`),
	);
	return match?.[1].default;
}

function normalizeSlug(entryId: string): string {
	return entryId.split("/")[0];
}

export async function getAllRecipes(): Promise<Recipe[]> {
	const entries = await getCollection("recipes");

	return entries.map((entry) => {
		const slug = normalizeSlug(entry.id);
		const image = resolveRecipeImage(slug);

		if (!image) {
			throw new Error(`Missing recipe image for ${slug}`);
		}

		return {
			slug,
			data: entry.data,
			image,
		};
	});
}

export async function getRecipeBySlug(
	slug: string,
): Promise<Recipe | undefined> {
	const recipes = await getAllRecipes();
	return recipes.find((recipe) => recipe.slug === slug);
}
