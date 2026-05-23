import { deduplicate, deduplicateBy } from "common-stuff";
import type { Recipe } from "@/types/content";

export interface List {
	name: string;
	recipes: string[];
}

export const LIST_STORAGE_KEY = "my-lists";

const dedupeList = (list: List): List => ({
	...list,
	recipes: deduplicate(list.recipes),
});

export const dedupeLists = (lists: List[]): List[] =>
	deduplicateBy(lists, (v) => v.name).map(dedupeList);

export const getListUrl = (list: List): string => {
	const params = new URLSearchParams({
		n: list.name,
		r: list.recipes.join(" "),
	});
	return `/list/?${params.toString()}`;
};

export const parseListFromParams = (params: URLSearchParams): List => ({
	name: params.get("n") ?? "",
	recipes: (params.get("r") ?? "").split(" ").filter(Boolean),
});

export const getListRecipes = (list: List, allRecipes: Recipe[]): Recipe[] => {
	const bySlug = new Map(allRecipes.map((r) => [r.slug, r]));
	return list.recipes
		.map((slug) => bySlug.get(slug))
		.filter((r): r is Recipe => r !== undefined);
};
