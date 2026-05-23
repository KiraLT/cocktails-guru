import { useMemo } from "react";
import { FaCircleInfo, FaMartiniGlass, FaTrashCan } from "react-icons/fa6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { getListRecipes, getListUrl, type List } from "@/lib/list";
import { useListsStore } from "@/lib/lists-store";
import type { Recipe } from "@/types/content";

const PREVIEW_COUNT = 4;

export default function ListsContent({ recipes }: { recipes: Recipe[] }) {
	const hydrated = useHydrated();
	const lists = useListsStore((s) => s.lists);
	const remove = useListsStore((s) => s.remove);

	const recipesBySlug = useMemo(
		() => new Map(recipes.map((r) => [r.slug, r])),
		[recipes],
	);

	if (!hydrated) return null;

	if (lists.length === 0) {
		return (
			<Alert variant="info">
				<FaCircleInfo className="h-4 w-4" />
				<AlertDescription>
					You don't have any lists yet. Create one to get started.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{lists.map((list) => (
				<ListCard
					key={list.name}
					list={list}
					recipes={getListRecipes(list, recipes)}
					recipesBySlug={recipesBySlug}
					onDelete={() => {
						const displayName = list.name || "Unnamed list";
						if (window.confirm(`Delete list "${displayName}"?`)) {
							remove(list.name);
						}
					}}
				/>
			))}
		</ul>
	);
}

function ListCard({
	list,
	recipes,
	onDelete,
}: {
	list: List;
	recipes: Recipe[];
	recipesBySlug: Map<string, Recipe>;
	onDelete: () => void;
}) {
	const displayName = list.name || "Unnamed list";
	const count = recipes.length;
	const preview = recipes.slice(0, PREVIEW_COUNT);
	const remaining = Math.max(0, count - PREVIEW_COUNT);
	const names = recipes.map((r) => r.data.name);

	return (
		<li className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors hover:border-border">
			<a
				href={getListUrl(list)}
				className="block focus-visible:outline-none"
				aria-label={`Open list ${displayName}`}
			>
				<div className="relative aspect-video w-full bg-background">
					{preview.length > 0 ? (
						<div
							className="grid h-full w-full"
							style={{
								gridTemplateColumns: `repeat(${Math.min(preview.length, PREVIEW_COUNT)}, minmax(0, 1fr))`,
							}}
						>
							{preview.map((recipe) => (
								<div key={recipe.slug} className="relative overflow-hidden">
									<img
										src={recipe.image.src}
										alt=""
										width={recipe.image.width}
										height={recipe.image.height}
										loading="lazy"
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										style={{
											filter: "saturate(0.92) brightness(0.86)",
										}}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex h-full w-full items-center justify-center text-muted-foreground/60">
							<FaMartiniGlass className="h-10 w-10" />
						</div>
					)}
					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
					{remaining > 0 && (
						<span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
							+{remaining} more
						</span>
					)}
				</div>

				<div className="relative -mt-6 px-5 pb-5">
					<h2 className="truncate font-serif text-xl font-semibold text-foreground group-hover:underline">
						{displayName}
					</h2>
					<p className="mt-1 font-sans text-xs uppercase tracking-wider text-primary">
						{count} {count === 1 ? "recipe" : "recipes"}
					</p>
					{names.length > 0 && (
						<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
							{names.join(" · ")}
						</p>
					)}
				</div>
			</a>

			<Button
				variant="ghost"
				size="icon"
				aria-label={`Delete ${displayName}`}
				className="absolute right-2 top-2 z-10 h-8 w-8 bg-background/70 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
				onClick={(e) => {
					e.preventDefault();
					onDelete();
				}}
			>
				<FaTrashCan className="h-3.5 w-3.5" />
			</Button>
		</li>
	);
}
