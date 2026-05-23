import { ClassicTemplate } from "@/components/print/templates/Classic";
import { CompactTemplate } from "@/components/print/templates/Compact";
import { SpotlightTemplate } from "@/components/print/templates/Spotlight";
import type { Recipe } from "@/types/content";

export type TemplateId = "classic" | "spotlight" | "compact";

export interface TemplateMeta {
	id: TemplateId;
	name: string;
	description: string;
	density: string;
	Component: React.ComponentType<{ recipes: Recipe[]; title: string }>;
}

export const TEMPLATES: TemplateMeta[] = [
	{
		id: "classic",
		name: "Classic",
		description: "Restaurant-style numbered list with alternating thumbnails.",
		density: "4 cocktails per page",
		Component: ClassicTemplate,
	},
	{
		id: "spotlight",
		name: "Spotlight",
		description: "One cocktail per page with ingredients, method, and tips.",
		density: "1 cocktail per page",
		Component: SpotlightTemplate,
	},
	{
		id: "compact",
		name: "Compact",
		description: "Dense bartender reference — small cards in a 2×4 grid.",
		density: "8 cocktails per page",
		Component: CompactTemplate,
	},
];

export const DEFAULT_TEMPLATE: TemplateId = "classic";

export const findTemplate = (id: string | null | undefined): TemplateMeta =>
	TEMPLATES.find((t) => t.id === id) ??
	TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE) ??
	TEMPLATES[0];
