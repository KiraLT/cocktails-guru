import { FaCircleInfo } from "react-icons/fa6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useIngredientsStore } from "@/lib/ingredients-store";
import { aggregateShoppingList, formatCombined } from "@/lib/shopping-list";
import type { Recipe } from "@/types/content";

export function ShoppingList({
	recipes,
	yamlIngredientSlugs,
}: {
	recipes: Recipe[];
	yamlIngredientSlugs: string[];
}) {
	const hydrated = useHydrated();
	const store = useIngredientsStore();
	const scale = hydrated ? store.scale : 1;
	const units = hydrated ? store.units : "oz";

	const items = aggregateShoppingList(recipes, new Set(yamlIngredientSlugs), {
		scale,
		units,
	});

	if (items.length === 0) {
		return (
			<Alert variant="info">
				<FaCircleInfo className="h-4 w-4" />
				<AlertDescription>
					Add recipes to the list to build a shopping list.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<section className="space-y-3">
			<header className="flex items-baseline justify-between gap-3">
				<h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
					Shopping list
				</h2>
				<span className="text-xs text-muted-foreground tabular-nums">
					{items.length} {items.length === 1 ? "ingredient" : "ingredients"}
					{hydrated && scale > 1 ? ` · ${scale}× scale` : ""}
				</span>
			</header>

			<ul className="space-y-2">
				{items.map((item) => {
					const combined = formatCombined(item.combined);
					return (
						<li
							key={item.slug}
							className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3"
						>
							<input
								type="checkbox"
								className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-primary"
								aria-label={`Mark ${item.displayName} as bought`}
							/>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
									<a
										href={`/ingredients/${item.slug}/`}
										className="font-medium text-foreground hover:underline"
									>
										{item.displayName}
									</a>
									{combined && (
										<span className="text-sm text-muted-foreground tabular-nums">
											{combined}
										</span>
									)}
									{item.freeform.length > 0 && (
										<span className="text-sm text-muted-foreground">
											{item.freeform.map((f) => f.quantity).join(", ")}
										</span>
									)}
								</div>
								<p className="mt-1 text-xs text-muted-foreground">
									For{" "}
									{item.usedIn
										.map((u) => u.name)
										.filter((v, i, arr) => arr.indexOf(v) === i)
										.join(", ")}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
