import { TEMPLATES, type TemplateId } from "@/components/print/registry";

interface Props {
	onSelect: (id: TemplateId) => void;
}

/**
 * Stylised preview thumbnails. Each one mirrors the actual template at a
 * glance — dark site palette, alternating rows for Classic, single-page
 * spotlight for Spotlight, column-flow card grid for Compact.
 */
function Preview({ id }: { id: TemplateId }) {
	if (id === "classic") {
		return (
			<div className="h-full w-full bg-background p-2 text-foreground">
				<div className="flex items-center justify-center gap-1">
					<span className="h-px w-3 bg-primary" />
					<span className="text-[6px] text-primary">✦</span>
					<span className="h-px w-3 bg-primary" />
				</div>
				<div className="mx-auto mt-1 h-1.5 w-2/3 bg-foreground/85" />
				<div className="mt-2 space-y-1.5">
					{[0, 1, 2].map((i) =>
						i % 2 === 0 ? (
							<div key={i} className="flex gap-1.5">
								<div className="h-4 w-4 shrink-0 border border-primary bg-foreground/70 p-px" />
								<div className="flex-1 space-y-0.5">
									<div className="h-0.5 w-2/3 bg-primary" />
									<div className="h-px w-full bg-foreground/40" />
									<div className="h-px w-full bg-foreground/40" />
									<div className="h-px w-3/4 bg-foreground/40" />
								</div>
							</div>
						) : (
							<div key={i} className="flex gap-1.5">
								<div className="flex-1 space-y-0.5 text-right">
									<div className="ml-auto h-0.5 w-2/3 bg-primary" />
									<div className="h-px w-full bg-foreground/40" />
									<div className="h-px w-full bg-foreground/40" />
									<div className="ml-auto h-px w-3/4 bg-foreground/40" />
								</div>
								<div className="h-4 w-4 shrink-0 border border-primary bg-foreground/70 p-px" />
							</div>
						),
					)}
				</div>
			</div>
		);
	}

	if (id === "spotlight") {
		return (
			<div className="flex h-full w-full flex-col items-center bg-background p-2 text-center text-foreground">
				<span className="text-[5px] uppercase tracking-[0.3em] text-primary">
					№ 01
				</span>
				<div className="mt-1 w-full border border-primary/60 bg-card p-0.5">
					<div className="h-8 w-full bg-foreground/70" />
				</div>
				<div className="mt-1 h-1.5 w-3/4 bg-foreground/90" />
				<div className="mt-0.5 h-px w-6 bg-primary" />
				<div className="mt-1 w-3/4 space-y-0.5">
					<div className="h-px w-full bg-foreground/40" />
					<div className="h-px w-5/6 bg-foreground/40" />
					<div className="h-px w-full bg-foreground/40" />
				</div>
			</div>
		);
	}

	// compact
	return (
		<div className="h-full w-full bg-background p-2 text-foreground">
			<div className="flex items-baseline justify-between border-b border-border pb-0.5">
				<div className="h-1 w-8 bg-foreground/85" />
				<div className="h-0.5 w-3 bg-primary" />
			</div>
			<div
				className="mt-1.5 grid gap-1"
				style={{
					gridTemplateColumns: "1fr 1fr",
					gridTemplateRows: "repeat(4, 1fr)",
				}}
			>
				{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
					<div
						key={i}
						className="flex gap-1 border border-border bg-card p-0.5"
					>
						<div className="aspect-square h-full shrink-0 border border-border bg-foreground/70" />
						<div className="flex-1 space-y-0.5">
							<div className="h-0.5 w-3/4 bg-primary" />
							<div className="h-px w-full bg-foreground/35" />
							<div className="h-px w-5/6 bg-foreground/35" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function TemplateGallery({ onSelect }: Props) {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			{TEMPLATES.map((template) => (
				<button
					type="button"
					key={template.id}
					onClick={() => onSelect(template.id)}
					className="group flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-3 text-left transition-colors hover:border-foreground/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={`Use ${template.name} template`}
				>
					<div className="aspect-3/4 overflow-hidden rounded-md border border-border/60">
						<Preview id={template.id} />
					</div>
					<div>
						<div className="flex items-baseline justify-between gap-2">
							<p className="font-serif text-base font-semibold text-foreground">
								{template.name}
							</p>
							<span className="text-[10px] uppercase tracking-wider text-muted-foreground">
								{template.density}
							</span>
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							{template.description}
						</p>
					</div>
				</button>
			))}
		</div>
	);
}
