import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

export const recipeSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	ingredients: z.record(z.string(), z.string()),
	instructions: z.array(z.string()),
	tips: z.array(z.string()).optional(),
	labels: z.array(z.enum(["signature"])).optional(),
	prepTimeMinutes: z.number().int().positive().optional(),
	cuisine: z.string().optional(),
	glass: z.string().optional(),
	garnish: z.string().optional(),
	servingYield: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	published: z.string().optional(),
});

export const ingredientSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	ingredients: z.record(z.string(), z.string()).optional(),
	instructions: z.array(z.string()).optional(),
	tips: z.array(z.string()).optional(),
	recommended: z
		.array(
			z.object({
				url: z.string(),
				name: z.string(),
				description: z.string(),
			}),
		)
		.optional(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
export type IngredientData = z.infer<typeof ingredientSchema>;

const recipes = defineCollection({
	loader: glob({ pattern: "**/data.yaml", base: "./src/content/recipes" }),
	schema: recipeSchema,
});

const ingredients = defineCollection({
	loader: glob({ pattern: "**/data.yaml", base: "./src/content/ingredients" }),
	schema: ingredientSchema,
});

export const collections = {
	recipes,
	ingredients,
};
