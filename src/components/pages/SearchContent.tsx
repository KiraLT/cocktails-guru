import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { Recipes } from "@/components/recipes";
import type { Recipe } from "@/types/content";

export default function SearchContent({ recipes }: { recipes: Recipe[] }) {
	const [query, setQuery] = useState<string | null | undefined>(undefined);

	const fuse = useMemo(() => {
		return new Fuse<Recipe>(recipes, {
			includeScore: true,
			keys: [
				{ name: "name", weight: 3, getFn: (v) => v.data.name },
				{
					name: "ingredients",
					weight: 2,
					getFn: (v) => Object.keys(v.data.ingredients).join(" "),
				},
				{
					name: "description",
					weight: 1,
					getFn: (v) => v.data.description ?? "",
				},
			],
			threshold: 0.3,
		});
	}, [recipes]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setQuery(params.get("q"));
	}, []);

	const result = useMemo(() => {
		if (query === undefined) return [];
		const normalized = (query ?? "").trim().toLowerCase();
		if (!normalized) return recipes;

		const terms = normalized.split(/\s+/).filter(Boolean);
		const strictMatches = recipes.filter((recipe) => {
			const searchable = [
				recipe.data.name,
				Object.keys(recipe.data.ingredients).join(" "),
				recipe.data.description ?? "",
			]
				.join(" ")
				.toLowerCase();
			return terms.every((term) => searchable.includes(term));
		});

		if (strictMatches.length > 0) return strictMatches;

		return fuse
			.search(normalized)
			.filter((entry) => (entry.score ?? 1) <= 0.35)
			.map((entry) => entry.item);
	}, [fuse, query, recipes]);

	const isLoading = query === undefined;

	return (
		<>
			<section className="mb-6 md:mb-8">
				<h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
					{isLoading || query ? "Search results" : "All recipes"}
				</h1>
				{isLoading ? (
					<p className="mt-2 text-sm text-muted-foreground md:text-base">
						Loading…
					</p>
				) : query ? (
					<p className="mt-2 text-sm text-muted-foreground md:text-base">
						{result.length} {result.length === 1 ? "match" : "matches"} for{" "}
						<span className="text-foreground font-medium">“{query}”</span>
					</p>
				) : (
					<p className="mt-2 text-sm text-muted-foreground md:text-base">
						Browse every cocktail in our collection.
					</p>
				)}
			</section>
			{!isLoading && <Recipes recipes={result} />}
		</>
	);
}
