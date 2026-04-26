import { titleCase } from "common-stuff";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { parseQuantity, stringifyQuantity } from "@/lib/ingredients-utils";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/types/content";

type Units = "oz" | "ml";
type Scale = 1 | 2 | 3 | 4;

const ML_PER_OZ = 30;

const useIngredientsStore = create(
	persist<{
		units: Units;
		scale: Scale;
		setUnits: (units: Units) => void;
		setScale: (scale: Scale) => void;
	}>(
		(set) => ({
			units: "oz",
			scale: 1,
			setUnits: (units) => set({ units }),
			setScale: (scale) => set({ scale }),
		}),
		{ name: "recipe-ingredients-store" },
	),
);

function convertQuantity(
	value: number,
	fromUnit: string,
	toUnit: Units,
): [number, string] {
	if (fromUnit === "oz" && toUnit === "ml") {
		return [Math.round(value * ML_PER_OZ), "ml"];
	}
	if (fromUnit === "ml" && toUnit === "oz") {
		return [Math.round((value / ML_PER_OZ) * 100) / 100, "oz"];
	}
	return [value, fromUnit];
}

export function Ingredients({
	ingredients,
	ingredientIndex,
	className,
}: {
	ingredients: Record<string, string>;
	ingredientIndex: Record<string, Ingredient>;
	className?: string;
}) {
	const { units, scale, setUnits, setScale } = useIngredientsStore();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

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
						onValueChange={(value) => setScale(Number(value) as Scale)}
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
						onValueChange={(value) => setUnits(value as Units)}
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
				{Object.entries(ingredients).map(([slug, quantity]) => {
					const ingredient = ingredientIndex[slug];
					const [rawValue, rawUnits] = parseQuantity(quantity);
					const scaledValue = rawValue * scale;
					const [converted, convertedUnits] = convertQuantity(
						scaledValue,
						rawUnits,
						units,
					);
					const formatted = Number.isFinite(converted)
						? stringifyQuantity(converted, convertedUnits)
						: quantity;

					return (
						<li key={slug}>
							<label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-background/50 px-3 py-2.5 transition-colors hover:border-border hover:bg-accent/40">
								<input
									type="checkbox"
									className="h-4 w-4 shrink-0 rounded border-input accent-primary"
								/>
								<span className="min-w-0 flex-1">
									{ingredient ? (
										<a
											href={`/ingredients/${slug}/`}
											className="font-medium text-foreground hover:underline"
											onClick={(event) => event.stopPropagation()}
										>
											{ingredient.data.name}
										</a>
									) : (
										<span className="font-medium text-foreground">
											{titleCase(slug.split("-").join(" "))}
										</span>
									)}
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
