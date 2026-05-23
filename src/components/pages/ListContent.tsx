import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
	FaCircleInfo,
	FaPenToSquare,
	FaShareFromSquare,
} from "react-icons/fa6";
import { ShoppingList } from "@/components/pages/ShoppingList";
import { Recipes } from "@/components/recipes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { getListRecipes, getListUrl, parseListFromParams } from "@/lib/list";
import { useListsStore } from "@/lib/lists-store";
import type { Recipe } from "@/types/content";

const EditList = lazy(() =>
	import("@/components/pages/EditList").then((m) => ({ default: m.EditList })),
);
const Share = lazy(() =>
	import("@/components/share").then((m) => ({ default: m.Share })),
);

export default function ListContent({
	recipes: allRecipes,
	yamlIngredientSlugs,
}: {
	recipes: Recipe[];
	yamlIngredientSlugs: string[];
}) {
	const hydrated = useHydrated();
	const upsert = useListsStore((s) => s.upsert);
	const [list, setList] = useState<ReturnType<typeof parseListFromParams>>({
		name: "",
		recipes: [],
	});
	const [shareOpen, setShareOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setList(parseListFromParams(params));
	}, []);

	const recipes = useMemo(
		() => getListRecipes(list, allRecipes),
		[list, allRecipes],
	);

	if (!hydrated) return null;

	const displayName = list.name || "Unnamed list";

	return (
		<>
			<section className="mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
				<div className="min-w-0 flex-1">
					<h1 className="truncate font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
						{displayName}
					</h1>
					<p className="mt-2 text-sm text-muted-foreground md:text-base">
						{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => setShareOpen(true)}
						aria-label="Share list"
					>
						<FaShareFromSquare />
						<span className="hidden sm:inline">Share</span>
					</Button>
					<Button onClick={() => setEditOpen(true)} aria-label="Edit list">
						<FaPenToSquare />
						<span className="hidden sm:inline">Edit</span>
					</Button>
				</div>
			</section>

			{list.recipes.length === 0 ? (
				<Alert variant="info">
					<FaCircleInfo className="h-4 w-4" />
					<AlertDescription>
						This list is empty — click Edit to add recipes.
					</AlertDescription>
				</Alert>
			) : (
				<>
					<Recipes recipes={recipes} />
					<div className="mt-10">
						<ShoppingList
							recipes={recipes}
							yamlIngredientSlugs={yamlIngredientSlugs}
						/>
					</div>
				</>
			)}

			<Dialog open={shareOpen} onOpenChange={setShareOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Share list</DialogTitle>
						<DialogDescription>
							Anyone with this link can view the list.
						</DialogDescription>
					</DialogHeader>
					<Suspense fallback={null}>{shareOpen && <Share />}</Suspense>
				</DialogContent>
			</Dialog>

			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit list</DialogTitle>
						<DialogDescription>
							Rename, add or remove recipes, and reorder.
						</DialogDescription>
					</DialogHeader>
					<Suspense fallback={null}>
						{editOpen && (
							<EditList
								list={list}
								allRecipes={allRecipes}
								onSave={(next) => {
									upsert(next, list.name);
									const nextUrl = getListUrl(next);
									window.history.replaceState(null, "", nextUrl);
									setList(next);
									setEditOpen(false);
								}}
							/>
						)}
					</Suspense>
				</DialogContent>
			</Dialog>
		</>
	);
}
