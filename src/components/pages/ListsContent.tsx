import { useCallback, useEffect, useState } from "react";
import { FaCircleInfo, FaTrashCan } from "react-icons/fa6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { List } from "@/controllers/lists";
import { deleteListByName, getAllLists, getListUrl } from "@/controllers/lists";

export default function ListsContent() {
	const [lists, setLists] = useState<List[] | null>(null);

	const loadLists = useCallback(() => {
		setLists(getAllLists());
	}, []);

	useEffect(() => {
		loadLists();
	}, [loadLists]);

	if (lists === null) {
		return null;
	}

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
		<ul className="grid gap-3 sm:grid-cols-2">
			{lists.map((list) => {
				const count = list.recipes.length;
				return (
					<li
						key={list.name}
						className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-colors hover:border-border"
					>
						<a
							href={getListUrl(list)}
							className="min-w-0 flex-1 focus-visible:outline-none"
						>
							<p className="truncate text-base font-semibold text-foreground group-hover:underline">
								{list.name || "Unnamed list"}
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{count} {count === 1 ? "recipe" : "recipes"}
							</p>
						</a>
						<Button
							variant="ghost"
							size="icon"
							aria-label={`Delete ${list.name || "Unnamed list"}`}
							className="text-muted-foreground hover:text-destructive"
							onClick={() => {
								if (
									window.confirm(
										`Delete list "${list.name || "Unnamed list"}"?`,
									)
								) {
									deleteListByName(list.name);
									loadLists();
								}
							}}
						>
							<FaTrashCan />
						</Button>
					</li>
				);
			})}
		</ul>
	);
}
