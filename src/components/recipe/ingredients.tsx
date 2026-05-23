import { titleCase } from "common-stuff";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { type Scale, useIngredientsStore } from "@/lib/ingredients-store";
import {
	convertQuantity,
	ingredientSlug,
	parseQuantity,
	stringifyQuantity,
	type VolumeUnit,
} from "@/lib/ingredients-utils";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/types/content";

const DEFAULT_UNITS: VolumeUnit = "oz";
const DEFAULT_SCALE: Scale = 1;

export function Ingredients({
	ingredients,
	ingredientIndex,
	className,
}: {
	ingredients: Record<string, string>;
	ingredientIndex: Record<string, Ingredient>;
	className?: string;
}) {
	const hydrated = useHydrated();
	const store = useIngredientsStore();

	// Pre-hydration we render with deterministic defaults so the static HTML
	// contains the ingredient links (crawlable, accessible to no-JS users)
	// and we don't get a hydration mismatch from the persisted store.
	const units = hydrated ? store.units : DEFAULT_UNITS;
	const scale = hydrated ? store.scale : DEFAULT_SCALE;

	return (
		<section
			className={cn(
				"rounded-xl border border-border/60 bg-card p-5 md:p-6",
				className,
			)}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="font-serif text-lg font-semibold">Ingredients</h2>
					<p className="text-xs text-muted-foreground">
						Scale and switch units.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Select
						value={String(scale)}
						onValueChange={(value) => store.setScale(Number(value) as Scale)}
					>
						<SelectTrigger className="h-8 w-20 rounded-full text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1×</SelectItem>
							<SelectItem value="2">2×</SelectItem>
							<SelectItem value="3">3×</SelectItem>
							<SelectItem value="4">4×</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={units}
						onValueChange={(value) => store.setUnits(value as VolumeUnit)}
					>
						<SelectTrigger className="h-8 w-20 rounded-full text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="oz">oz</SelectItem>
							<SelectItem value="ml">ml</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<ul className="mt-4 space-y-2">
				{Object.entries(ingredients).map(([rawName, quantity]) => {
					const linkSlug = ingredientSlug(rawName);
					const yamlMatch =
						ingredientIndex[rawName] ?? ingredientIndex[linkSlug];
					const displayName =
						yamlMatch?.data.name ?? titleCase(rawName.split("-").join(" "));
					const parsed = parseQuantity(quantity);
					const scaled = { ...parsed, amount: parsed.amount * scale };
					const converted = convertQuantity(scaled.amount, scaled.unit, units);
					const formatted = Number.isFinite(converted.amount)
						? stringifyQuantity(converted)
						: quantity;

					return (
						<li key={rawName}>
							<label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-background/50 px-3 py-2.5 transition-colors hover:border-border hover:bg-accent/40">
								<input
									type="checkbox"
									className="h-4 w-4 shrink-0 rounded border-input accent-primary"
								/>
								<span className="min-w-0 flex-1">
									<a
										href={`/ingredients/${linkSlug}/`}
										className="font-medium text-foreground hover:underline"
										onClick={(event) => event.stopPropagation()}
									>
										{displayName}
									</a>
								</span>
								<span className="shrink-0 text-sm tabular-nums text-muted-foreground">
									{formatted}
								</span>
							</label>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
