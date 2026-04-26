import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import type { Ingredient } from "@/types/content";

const ingredientImages = import.meta.glob<{ default: ImageMetadata }>(
	"../content/ingredients/**/image.png",
	{ eager: true },
);

function resolveIngredientImage(slug: string): ImageMetadata | undefined {
	const match = Object.entries(ingredientImages).find(([path]) =>
		path.endsWith(`/ingredients/${slug}/image.png`),
	);
	return match?.[1].default;
}

function normalizeSlug(entryId: string): string {
	return entryId.split("/")[0];
}

export async function getAllIngredients(): Promise<Ingredient[]> {
	const entries = await getCollection("ingredients");

	return entries.map((entry) => {
		const slug = normalizeSlug(entry.id);
		const image = resolveIngredientImage(slug);

		if (!image) {
			throw new Error(`Missing ingredient image for ${slug}`);
		}

		return {
			slug,
			data: entry.data,
			image,
		};
	});
}

export async function getIngredientBySlug(
	slug: string,
): Promise<Ingredient | undefined> {
	const ingredients = await getAllIngredients();
	return ingredients.find((ingredient) => ingredient.slug === slug);
}
