import type { Recipe } from "@/types/content";

export function SpotlightTemplate({
	recipes,
	title,
}: {
	recipes: Recipe[];
	title: string;
}) {
	return (
		<article className="bg-background font-serif text-foreground">
			<header
				className="flex flex-col items-center justify-center text-center"
				style={{
					padding: "2.4cm 1.6cm",
					minHeight: "100vh",
					breakAfter: "page",
				}}
			>
				<p className="font-sans text-[9pt] uppercase tracking-[0.5em] text-primary">
					Cocktail Menu
				</p>
				<div
					className="mt-6 flex items-center justify-center gap-4"
					aria-hidden="true"
				>
					<span className="h-px w-20 bg-border" />
					<span className="text-[18pt] text-primary">✦</span>
					<span className="h-px w-20 bg-border" />
				</div>
				<h1 className="mt-5 text-[44pt] font-semibold italic leading-none tracking-tight">
					{title}
				</h1>
				<p className="mt-5 font-sans text-[8.5pt] uppercase tracking-[0.36em] text-muted-foreground">
					{recipes.length} {recipes.length === 1 ? "cocktail" : "cocktails"}
				</p>
			</header>

			{recipes.map((recipe, index) => {
				const initial = recipe.data.name.charAt(0);
				const rest = recipe.data.name.slice(1);
				const ingredients = Object.entries(recipe.data.ingredients);
				const tips = recipe.data.tips ?? [];
				const isLast = index === recipes.length - 1;
				return (
					<section
						key={recipe.slug}
						className="flex flex-col items-center"
						style={{
							padding: "1.4cm 1.6cm",
							minHeight: "100vh",
							breakAfter: isLast ? "auto" : "page",
						}}
					>
						<p className="font-sans text-[8.5pt] uppercase tracking-[0.4em] text-primary">
							№ {String(index + 1).padStart(2, "0")} · Cocktail
						</p>

						<figure className="mt-3 w-full" style={{ maxWidth: "13cm" }}>
							<div className="relative border border-border bg-card p-2">
								<div className="border border-primary/50 p-1">
									<img
										src={recipe.image.src}
										alt=""
										width={recipe.image.width}
										height={recipe.image.height}
										className="block w-full object-cover"
										style={{
											height: "8.5cm",
											filter: "saturate(0.85) contrast(1.08) brightness(0.92)",
										}}
									/>
								</div>
							</div>
						</figure>

						<div className="mt-5 text-center">
							<h2 className="text-[30pt] font-semibold italic leading-none tracking-tight">
								<span className="text-primary">{initial}</span>
								{rest}
							</h2>
							{(recipe.data.glass || recipe.data.garnish) && (
								<p className="mt-2 font-sans text-[8pt] uppercase tracking-[0.28em] text-muted-foreground">
									{recipe.data.glass}
									{recipe.data.glass && recipe.data.garnish ? (
										<span className="text-primary"> · </span>
									) : null}
									{recipe.data.garnish}
								</p>
							)}
						</div>

						<div
							className="mt-6 grid w-full gap-8"
							style={{
								maxWidth: "14cm",
								gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
							}}
						>
							<div>
								<SectionHeading label="Ingredients" />
								{ingredients.length > 0 ? (
									<ul className="mt-3 list-none space-y-1.5 text-[10.5pt] leading-snug text-foreground/90">
										{ingredients.map(([name, qty]) => (
											<li
												key={name}
												className="flex items-baseline justify-between gap-2 border-b border-dotted border-border/60 pb-1"
											>
												<span className="capitalize">{name}</span>
												<span className="shrink-0 font-sans text-[9pt] text-primary tabular-nums">
													{qty}
												</span>
											</li>
										))}
									</ul>
								) : null}
							</div>

							<div>
								<SectionHeading label="Method" />
								<ol className="mt-3 list-none space-y-2 text-[10.5pt] leading-snug text-foreground/90">
									{recipe.data.instructions.map((step, stepIdx) => (
										<li
											key={step}
											className="grid items-baseline gap-2"
											style={{ gridTemplateColumns: "1.6em 1fr" }}
										>
											<span className="font-sans text-[8.5pt] font-semibold uppercase tracking-wider text-primary tabular-nums">
												{romanize(stepIdx + 1)}.
											</span>
											<span>{step}</span>
										</li>
									))}
								</ol>
							</div>
						</div>

						{tips.length > 0 && (
							<div className="mt-6 w-full" style={{ maxWidth: "14cm" }}>
								<SectionHeading label="Bartender's Tips" />
								<ul className="mt-3 list-none space-y-1.5 text-[9.5pt] italic leading-snug text-foreground/80">
									{tips.map((tip) => (
										<li key={tip} className="flex gap-2">
											<span
												aria-hidden="true"
												className="text-[8pt] text-primary"
											>
												❦
											</span>
											<span>{tip}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						<div
							className="mt-auto flex items-center justify-center gap-4 pt-8"
							aria-hidden="true"
						>
							<span className="h-px w-24 bg-border" />
							<span className="text-[12pt] text-primary">❦</span>
							<span className="h-px w-24 bg-border" />
						</div>
					</section>
				);
			})}
		</article>
	);
}

function SectionHeading({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-3" aria-hidden="false">
			<span className="font-sans text-[8.5pt] uppercase tracking-[0.32em] text-primary">
				{label}
			</span>
			<span className="h-px flex-1 bg-border" aria-hidden="true" />
		</div>
	);
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
