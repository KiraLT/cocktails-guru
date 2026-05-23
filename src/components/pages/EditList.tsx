import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import {
	FaCircleInfo,
	FaGripVertical,
	FaPlus,
	FaTrashCan,
	FaXmark,
} from "react-icons/fa6";
import ReactSortableModule from "react-sortablejs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getListRecipes, type List } from "@/lib/list";
import type { Recipe } from "@/types/content";

type SortableItem = { id: string };

const ReactSortable =
	ReactSortableModule.ReactSortable as typeof ReactSortableModule.ReactSortable;

export function EditList({
	list: originalList,
	allRecipes,
	onSave,
}: {
	list: List;
	allRecipes: Recipe[];
	onSave: (list: List) => void;
}) {
	const [list, setList] = useState(originalList);
	const [addMode, setAddMode] = useState(false);

	const listRecipes = useMemo(
		() => getListRecipes(list, allRecipes),
		[list, allRecipes],
	);
	const nonListRecipes = useMemo(
		() => allRecipes.filter((v) => !list.recipes.includes(v.slug)),
		[allRecipes, list.recipes],
	);

	return (
		<div className="space-y-4">
			<div>
				<label
					htmlFor="list-name"
					className="mb-1.5 block text-xs font-medium text-muted-foreground"
				>
					List name
				</label>
				<Input
					id="list-name"
					type="text"
					placeholder="Unnamed list"
					defaultValue={list.name}
					onChange={(event) => setList({ ...list, name: event.target.value })}
				/>
			</div>

			{addMode ? (
				<AddView
					recipes={nonListRecipes}
					onAdd={(id) => setList({ ...list, recipes: [...list.recipes, id] })}
					onClose={() => setAddMode(false)}
				/>
			) : (
				<>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => setAddMode(true)}
					>
						<FaPlus />
						Add recipe
					</Button>
					<EditView
						recipes={listRecipes}
						onRemove={(id) =>
							setList({
								...list,
								recipes: list.recipes.filter((v) => v !== id),
							})
						}
						onReorder={(recipes) => setList({ ...list, recipes })}
					/>
				</>
			)}

			<div className="flex justify-end pt-1">
				<Button onClick={() => onSave(list)}>Save changes</Button>
			</div>
		</div>
	);
}

function AddView({
	recipes,
	onAdd,
	onClose,
}: {
	recipes: Recipe[];
	onAdd: (slug: string) => void;
	onClose: () => void;
}) {
	const [query, setQuery] = useState("");

	const fuse = useMemo(
		() => new Fuse(recipes, { keys: ["data.name"] }),
		[recipes],
	);

	const result = useMemo(() => {
		return query.trim() ? fuse.search(query).map((v) => v.item) : recipes;
	}, [fuse, query, recipes]);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Input
					type="search"
					placeholder="Search recipes…"
					autoFocus
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					aria-label="Close search"
				>
					<FaXmark />
				</Button>
			</div>
			{result.length > 0 ? (
				<ul className="max-h-[45svh] divide-y divide-border/60 overflow-y-auto rounded-md border border-border/60">
					{result.map((recipe) => (
						<li key={recipe.slug}>
							<button
								type="button"
								className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
								onClick={() => onAdd(recipe.slug)}
							>
								<span className="truncate">{recipe.data.name}</span>
								<FaPlus className="shrink-0 text-muted-foreground" />
							</button>
						</li>
					))}
				</ul>
			) : (
				<Alert variant="info">
					<FaCircleInfo className="h-4 w-4" />
					<AlertDescription>No recipes were found.</AlertDescription>
				</Alert>
			)}
		</div>
	);
}

function EditView({
	recipes,
	onRemove,
	onReorder,
}: {
	recipes: Recipe[];
	onReorder: (recipes: string[]) => void;
	onRemove: (slug: string) => void;
}) {
	if (recipes.length === 0) {
		return (
			<Alert variant="info">
				<FaCircleInfo className="h-4 w-4" />
				<AlertDescription>
					This list is empty — add recipes to it.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="max-h-[45svh] overflow-y-auto rounded-md border border-border/60">
			<ReactSortable
				tag="ul"
				className="divide-y divide-border/60"
				list={recipes.map((v) => ({ id: v.slug }))}
				setList={(state: SortableItem[]) =>
					onReorder(state.map((item) => item.id))
				}
				handle=".handle"
			>
				{recipes.map((recipe) => (
					<li key={recipe.slug} className="flex items-center gap-2 px-2 py-2">
						<span
							className="handle cursor-grab rounded p-2 text-muted-foreground hover:bg-accent active:cursor-grabbing"
							title="Drag to reorder"
						>
							<FaGripVertical />
							<span className="sr-only">Drag to reorder</span>
						</span>
						<span className="flex-1 truncate text-sm font-medium text-foreground">
							{recipe.data.name}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="text-muted-foreground hover:text-destructive"
							onClick={() => onRemove(recipe.slug)}
							aria-label={`Remove ${recipe.data.name}`}
						>
							<FaTrashCan />
						</Button>
					</li>
				))}
			</ReactSortable>
		</div>
	);
}
