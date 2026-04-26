import type { ImageMetadata } from "astro";

export interface ImageRef {
	src: string;
	width: number;
	height: number;
}

export interface RecipeData {
	name: string;
	description?: string;
	ingredients: Record<string, string>;
	instructions: string[];
	tips?: string[];
	labels?: Array<"signature">;
}

export interface Recipe {
	slug: string;
	data: RecipeData;
	image: ImageMetadata;
}

export interface IngredientData {
	name: string;
	description?: string;
	ingredients?: Record<string, string>;
	instructions?: string[];
	tips?: string[];
	recommended?: {
		name: string;
		url: string;
		description: string;
	}[];
}

export interface Ingredient {
	slug: string;
	data: IngredientData;
	image: ImageMetadata;
}
