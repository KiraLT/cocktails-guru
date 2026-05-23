import { titleCase } from "common-stuff";
import {
	convertQuantity,
	ingredientSlug,
	parseQuantity,
	stringifyQuantity,
	type VolumeUnit,
} from "@/lib/ingredients-utils";
import type { Recipe } from "@/types/content";

export interface ShoppingItem {
	slug: string;
	displayName: string;
	hasIngredientPage: boolean;
	combined: { amount: number; unit: string }[];
	freeform: { quantity: string; recipe: string }[];
	usedIn: { slug: string; name: string }[];
}

export interface AggregateOptions {
	scale?: number;
	units?: VolumeUnit;
}

export function aggregateShoppingList(
	recipes: Recipe[],
	yamlSlugs: Set<string>,
	options: AggregateOptions = {},
): ShoppingItem[] {
	const scale = options.scale ?? 1;
	const targetUnits = options.units;
	const byKey = new Map<string, ShoppingItem>();

	for (const recipe of recipes) {
		const ingredients = recipe.data.ingredients ?? {};
		for (const [rawName, quantity] of Object.entries(ingredients)) {
			const slug = ingredientSlug(rawName);
			const displayName = titleCase(rawName.split("-").join(" "));
			let item = byKey.get(slug);
			if (!item) {
				item = {
					slug,
					displayName,
					hasIngredientPage: yamlSlugs.has(slug),
					combined: [],
					freeform: [],
					usedIn: [],
				};
				byKey.set(slug, item);
			}
			if (!item.usedIn.some((u) => u.slug === recipe.slug)) {
				item.usedIn.push({ slug: recipe.slug, name: recipe.data.name });
			}

			const parsed = parseQuantity(quantity);
			const scaledAmount = parsed.amount * scale;
			if (Number.isFinite(scaledAmount) && scaledAmount > 0 && parsed.unit) {
				const converted = targetUnits
					? convertQuantity(scaledAmount, parsed.unit, targetUnits)
					: { amount: scaledAmount, unit: parsed.unit };
				const existing = item.combined.find((c) => c.unit === converted.unit);
				if (existing) {
					existing.amount += converted.amount;
				} else {
					item.combined.push(converted);
				}
			} else {
				item.freeform.push({ quantity, recipe: recipe.data.name });
			}
		}
	}

	return Array.from(byKey.values()).sort((a, b) =>
		a.displayName.localeCompare(b.displayName),
	);
}

export function formatCombined(combined: ShoppingItem["combined"]): string {
	return combined
		.map((entry) => stringifyQuantity(entry))
		.filter(Boolean)
		.join(", ");
}
