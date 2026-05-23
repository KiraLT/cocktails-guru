import type { Recipe } from "@/types/content";

const ROWS = 4;
const COLS = 2;
const PER_PAGE = ROWS * COLS;

export function CompactTemplate({
	recipes,
	title,
}: {
	recipes: Recipe[];
	title: string;
}) {
	const pages = chunk(recipes, PER_PAGE);
	const lastIdx = pages.length - 1;

	return (
		<article className="bg-background font-serif text-foreground">
			{pages.map((pageRecipes, pageIdx) => (
				<section
					// biome-ignore lint/suspicious/noArrayIndexKey: pages are stable
					key={pageIdx}
					className="flex flex-col overflow-hidden"
					style={{
						padding: "1cm 1.2cm",
						height: "100vh",
						breakAfter: pageIdx === lastIdx ? "auto" : "page",
					}}
				>
					<header className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
						<div>
							<p className="font-sans text-[7.5pt] uppercase tracking-[0.32em] text-primary">
								Cocktail Reference
							</p>
							<h1 className="text-[16pt] font-semibold italic leading-tight tracking-tight">
								{title}
							</h1>
						</div>
						<p className="font-sans text-[7.5pt] uppercase tracking-[0.3em] text-muted-foreground">
							<span className="text-primary">✦</span> {recipes.length}{" "}
							{recipes.length === 1 ? "cocktail" : "cocktails"}
						</p>
					</header>

					<div
						className="grid min-h-0 flex-1 gap-3"
						style={{
							gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
							gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
						}}
					>
						{pageRecipes.map((recipe, localIdx) => {
							const globalIdx = pageIdx * PER_PAGE + localIdx;
							return (
								<article
									key={recipe.slug}
									className="flex min-h-0 gap-3 overflow-hidden border border-border bg-card"
									style={{ padding: "0.3cm 0.4cm" }}
								>
									<div
										className="shrink-0 self-start border border-border bg-background p-0.5"
										style={{ width: "2.4cm" }}
									>
										<img
											src={recipe.image.src}
											alt=""
											width={recipe.image.width}
											height={recipe.image.height}
											className="block aspect-square w-full object-cover"
											style={{
												filter:
													"saturate(0.85) contrast(1.05) brightness(0.94)",
											}}
										/>
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-baseline justify-between gap-2">
											<h2 className="truncate text-[12pt] font-semibold italic leading-tight tracking-tight">
												{recipe.data.name}
											</h2>
											<span className="shrink-0 font-sans text-[7pt] font-semibold uppercase tracking-[0.22em] text-primary tabular-nums">
												№ {String(globalIdx + 1).padStart(2, "0")}
											</span>
										</div>
										<div
											className="my-1 h-px w-8 bg-primary"
											aria-hidden="true"
										/>
										<ol className="list-none space-y-0.5 text-[8.5pt] leading-snug text-foreground/90">
											{recipe.data.instructions.map((step, stepIdx) => (
												<li key={step} className="flex gap-1.5">
													<span className="shrink-0 font-sans text-[7pt] font-semibold text-primary tabular-nums">
														{stepIdx + 1}.
													</span>
													<span>{step}</span>
												</li>
											))}
										</ol>
									</div>
								</article>
							);
						})}
					</div>
				</section>
			))}
		</article>
	);
}

function chunk<T>(arr: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}
