import type { Recipe } from "@/types/content";

const PER_PAGE = 4;

export function ClassicTemplate({
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
					className="flex flex-col"
					style={{
						padding: "1.4cm",
						minHeight: "100vh",
						breakAfter: pageIdx === lastIdx ? "auto" : "page",
					}}
				>
					<header className="mb-8 text-center">
						<p className="font-sans text-[8.5pt] uppercase tracking-[0.4em] text-primary">
							Cocktail Menu
						</p>
						<div
							className="mx-auto mt-3 flex items-center justify-center gap-3"
							aria-hidden="true"
						>
							<span className="h-px w-14 bg-border" />
							<span className="text-[14pt] text-primary">✦</span>
							<span className="h-px w-14 bg-border" />
						</div>
						<h1 className="mt-3 text-[30pt] font-semibold italic leading-[1.05] tracking-tight">
							{title}
						</h1>
						<p className="mt-2 font-sans text-[8.5pt] uppercase tracking-[0.28em] text-muted-foreground">
							<span className="text-primary">—</span> {recipes.length}{" "}
							{recipes.length === 1 ? "cocktail" : "cocktails"}{" "}
							<span className="text-primary">—</span>
						</p>
					</header>

					<ol className="flex-1 list-none space-y-8 p-0">
						{pageRecipes.map((recipe, localIdx) => {
							const globalIdx = pageIdx * PER_PAGE + localIdx;
							const imageLeft = globalIdx % 2 === 0;
							const figure = (
								<figure
									className="relative shrink-0"
									style={{ width: "4.2cm" }}
								>
									<div className="rounded-sm border border-border bg-card p-1">
										<img
											src={recipe.image.src}
											alt=""
											width={recipe.image.width}
											height={recipe.image.height}
											className="block aspect-square w-full rounded-sm object-cover"
											style={{
												filter:
													"saturate(0.88) contrast(1.05) brightness(0.94)",
											}}
										/>
									</div>
									<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 font-sans text-[8pt] uppercase tracking-[0.22em] text-primary">
										№ {String(globalIdx + 1).padStart(2, "0")}
									</span>
								</figure>
							);

							const body = (
								<div className="min-w-0 flex-1">
									<h2 className="text-[19pt] font-semibold italic leading-tight tracking-tight">
										{recipe.data.name}
									</h2>
									<div
										className="my-2 h-px w-16 bg-primary"
										aria-hidden="true"
									/>
									<ol className="list-none space-y-1 text-[10.5pt] leading-normal text-foreground/90">
										{recipe.data.instructions.map((step, stepIdx) => (
											<li key={step} className="flex gap-2">
												<span className="mt-[0.15em] shrink-0 font-sans text-[8pt] font-semibold uppercase tracking-wider text-primary tabular-nums">
													{romanize(stepIdx + 1)}
												</span>
												<span>{step}</span>
											</li>
										))}
									</ol>
								</div>
							);

							return (
								<li
									key={recipe.slug}
									className="flex items-start gap-6"
									style={{ breakInside: "avoid" }}
								>
									{imageLeft ? (
										<>
											{figure}
											{body}
										</>
									) : (
										<>
											{body}
											{figure}
										</>
									)}
								</li>
							);
						})}
					</ol>

					<footer className="mt-10 text-center">
						<div
							className="mx-auto flex items-center justify-center gap-3"
							aria-hidden="true"
						>
							<span className="h-px w-20 bg-border" />
							<span className="text-[12pt] text-primary">❦</span>
							<span className="h-px w-20 bg-border" />
						</div>
						<p className="mt-3 font-sans text-[7.5pt] uppercase tracking-[0.32em] text-muted-foreground">
							Drink responsibly · Cocktails Guru
						</p>
					</footer>
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

const ROMAN: ReadonlyArray<readonly [number, string]> = [
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"],
];

function romanize(n: number): string {
	let result = "";
	let remainder = n;
	for (const [value, glyph] of ROMAN) {
		while (remainder >= value) {
			result += glyph;
			remainder -= value;
		}
	}
	return result;
}
