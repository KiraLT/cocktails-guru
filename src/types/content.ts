import type { ImageMetadata } from "astro";
import type { IngredientData, RecipeData } from "@/content.config";

export type { IngredientData, RecipeData };

export interface ImageRef {
	src: string;
	width: number;
	height: number;
}

export interface Recipe {
	slug: string;
	data: RecipeData;
	image: ImageMetadata;
}

export interface Ingredient {
	slug: string;
	data: IngredientData;
	image: ImageMetadata;
}
