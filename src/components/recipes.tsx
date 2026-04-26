import { titleCase } from "common-stuff";
import { FaCircleInfo } from "react-icons/fa6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Recipe } from "@/types/content";

function formatIngredient(name: string): string {
	return titleCase(name.split("-").join(" "));
}

export function Recipes({ recipes }: { recipes: Recipe[] }) {
	if (!recipes?.length) {
		return (
			<Alert variant="info">
				<FaCircleInfo className="h-4 w-4" />
				<AlertDescription>No recipes were found.</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
			{recipes.map((recipe) => {
				const isSignature = recipe.data.labels?.includes("signature");
				const ingredientNames = Object.keys(recipe.data.ingredients ?? {});
				const visibleTags = ingredientNames.slice(0, 3);
				const overflow = ingredientNames.length - visibleTags.length;
				return (
					<a
						key={recipe.slug}
						href={`/recipes/${recipe.slug}/`}
						className="group relative block aspect-square overflow-hidden rounded-2xl bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						<img
							src={recipe.image.src}
							alt={recipe.data.name}
							width={recipe.image.width}
							height={recipe.image.height}
							loading="lazy"
							className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
						/>
						<div
							className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"
							aria-hidden="true"
						/>
						{isSignature && (
							<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur">
								<span aria-hidden="true">★</span>
								Signature
							</span>
						)}
						<div className="absolute inset-x-4 bottom-3.5 space-y-2">
							<h3 className="font-serif text-lg font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:text-xl">
								{recipe.data.name}
							</h3>
							{visibleTags.length > 0 && (
								<ul className="flex flex-nowrap gap-1.5 overflow-hidden mask-[linear-gradient(to_right,black_85%,transparent)]">
									{visibleTags.map((name) => (
										<li
											key={name}
											className="shrink-0 whitespace-nowrap rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/95 backdrop-blur-sm"
										>
											{formatIngredient(name)}
										</li>
									))}
									{overflow > 0 && (
										<li className="shrink-0 whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/75 backdrop-blur-sm">
											+{overflow} more
										</li>
									)}
								</ul>
							)}
						</div>
					</a>
				);
			})}
		</div>
	);
}
