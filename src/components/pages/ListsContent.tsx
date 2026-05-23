import { FaCircleInfo, FaTrashCan } from "react-icons/fa6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { getListUrl } from "@/lib/list";
import { useListsStore } from "@/lib/lists-store";

export default function ListsContent() {
	const hydrated = useHydrated();
	const lists = useListsStore((s) => s.lists);
	const remove = useListsStore((s) => s.remove);

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
		<ul className="grid gap-3 sm:grid-cols-2">
			{lists.map((list) => {
				const count = list.recipes.length;
				const displayName = list.name || "Unnamed list";
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
								{displayName}
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{count} {count === 1 ? "recipe" : "recipes"}
							</p>
						</a>
						<Button
							variant="ghost"
							size="icon"
							aria-label={`Delete ${displayName}`}
							className="text-muted-foreground hover:text-destructive"
							onClick={() => {
								if (window.confirm(`Delete list "${displayName}"?`)) {
									remove(list.name);
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
