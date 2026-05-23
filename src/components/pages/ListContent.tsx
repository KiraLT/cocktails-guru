import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	FaBasketShopping,
	FaCircleInfo,
	FaPenToSquare,
	FaPrint,
	FaShareFromSquare,
} from "react-icons/fa6";
import { ShoppingList } from "@/components/pages/ShoppingList";
import { findTemplate, type TemplateId } from "@/components/print/registry";
import { TemplateGallery } from "@/components/print/TemplateGallery";
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

const SHOPPING_PARAM = "view";
const SHOPPING_VALUE = "shopping";

const readShoppingFromUrl = () =>
	new URLSearchParams(window.location.search).get(SHOPPING_PARAM) ===
	SHOPPING_VALUE;

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
	const [printOpen, setPrintOpen] = useState(false);
	const [showShoppingList, setShowShoppingList] = useState(false);
	const [printTemplate, setPrintTemplate] = useState<TemplateId | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setList(parseListFromParams(params));
		setShowShoppingList(readShoppingFromUrl());
	}, []);

	const recipes = useMemo(
		() => getListRecipes(list, allRecipes),
		[list, allRecipes],
	);

	const syncShoppingUrl = useCallback((show: boolean) => {
		const params = new URLSearchParams(window.location.search);
		if (show) {
			params.set(SHOPPING_PARAM, SHOPPING_VALUE);
		} else {
			params.delete(SHOPPING_PARAM);
		}
		const query = params.toString();
		const next = `${window.location.pathname}${query ? `?${query}` : ""}`;
		window.history.replaceState(null, "", next);
	}, []);

	const toggleShopping = useCallback(() => {
		setShowShoppingList((current) => {
			const next = !current;
			syncShoppingUrl(next);
			return next;
		});
	}, [syncShoppingUrl]);

	const handlePrintSelect = useCallback((templateId: TemplateId) => {
		setPrintTemplate(templateId);
		setPrintOpen(false);
		// Two RAFs give React a tick to commit the print-only DOM before the
		// browser snapshots the page for printing.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => window.print());
		});
	}, []);

	if (!hydrated) return null;

	const displayName = list.name || "Unnamed list";
	const PrintTemplate = printTemplate
		? findTemplate(printTemplate).Component
		: null;

	return (
		<>
			<section
				className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden md:mb-8"
				data-print-hide
			>
				<div className="min-w-0 flex-1">
					<h1 className="truncate font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
						{displayName}
					</h1>
					<p className="mt-2 text-sm text-muted-foreground md:text-base">
						{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
						{showShoppingList ? " · Shopping list" : ""}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{recipes.length > 0 && (
						<>
							<Button
								variant={showShoppingList ? "default" : "outline"}
								onClick={toggleShopping}
								aria-pressed={showShoppingList}
								aria-label={
									showShoppingList ? "Hide shopping list" : "Show shopping list"
								}
							>
								<FaBasketShopping />
								<span className="hidden sm:inline">
									{showShoppingList ? "Recipes" : "Shopping list"}
								</span>
							</Button>
							<Button
								variant="outline"
								onClick={() => setPrintOpen(true)}
								aria-label="Print menu"
							>
								<FaPrint />
								<span className="hidden sm:inline">Print menu</span>
							</Button>
						</>
					)}
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

			<div className="print:hidden" data-print-hide>
				{list.recipes.length === 0 ? (
					<Alert variant="info">
						<FaCircleInfo className="h-4 w-4" />
						<AlertDescription>
							This list is empty — click Edit to add recipes.
						</AlertDescription>
					</Alert>
				) : showShoppingList ? (
					<ShoppingList
						recipes={recipes}
						yamlIngredientSlugs={yamlIngredientSlugs}
					/>
				) : (
					<Recipes recipes={recipes} />
				)}
			</div>

			{PrintTemplate && recipes.length > 0 && (
				<div className="hidden print:block" aria-hidden="true">
					<PrintTemplate recipes={recipes} title={displayName} />
				</div>
			)}

			<Dialog open={printOpen} onOpenChange={setPrintOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Choose a menu template</DialogTitle>
						<DialogDescription>
							Pick a layout — the print dialog will open right away.
						</DialogDescription>
					</DialogHeader>
					<TemplateGallery onSelect={handlePrintSelect} />
				</DialogContent>
			</Dialog>

			<Dialog open={shareOpen} onOpenChange={setShareOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{showShoppingList ? "Share shopping list" : "Share list"}
						</DialogTitle>
						<DialogDescription>
							Anyone with this link can view{" "}
							{showShoppingList ? "this shopping list" : "the list"}.
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
									const baseUrl = getListUrl(next);
									const finalUrl = showShoppingList
										? `${baseUrl}&${SHOPPING_PARAM}=${SHOPPING_VALUE}`
										: baseUrl;
									window.history.replaceState(null, "", finalUrl);
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
