import { deduplicate, deduplicateBy } from "common-stuff";
import type { Recipe } from "@/types/content";

export interface List {
	name: string;
	recipes: string[];
}

const localStorageKey = "my-lists";

export function getAllLists(): List[] {
	const string = window.localStorage.getItem(localStorageKey);
	return string ? (JSON.parse(string) as List[]) : [];
}

export function saveLists(lists: List[]): void {
	window.localStorage.setItem(
		localStorageKey,
		JSON.stringify(
			deduplicateBy(lists, (v) => v.name).map((v) => ({
				...v,
				recipes: deduplicate(v.recipes),
			})),
		),
	);
}

export function deleteListByName(name: string): void {
	saveLists(getAllLists().filter((v) => v.name !== name));
}

export function getListUrl(list: List): string {
	return `/list/?${new URLSearchParams({
		n: list.name,
		r: list.recipes.join(" "),
	})}`;
}

export function getListFromUrlQuery(
	query: Record<string, string | string[] | undefined | null>,
): List {
	const name = typeof query.n === "string" ? query.n : "";
	const recipeIds = typeof query.r === "string" ? query.r.split(" ") : [];

	return {
		name,
		recipes: recipeIds,
	};
}

export function replaceList(oldList: List, newList: List): void {
	saveLists([...getAllLists().filter((v) => v.name !== oldList.name), newList]);
}

export function getListRecipes(list: List, allRecipes: Recipe[]): Recipe[] {
	return list.recipes.flatMap((recipeId) =>
		allRecipes.filter((v) => v.slug === recipeId),
	);
}
