export type VolumeUnit = "oz" | "ml";

export interface Quantity {
	amount: number;
	unit: string;
}

const ML_PER_OZ = 30;

const FRACTIONS: ReadonlyArray<readonly [string, number]> = [
	["1/2", 0.5],
	["1/4", 0.25],
	["3/4", 0.75],
	["1/3", 0.33],
	["2/3", 0.66],
	["1/8", 0.125],
	["3/8", 0.375],
	["5/8", 0.625],
	["7/8", 0.875],
	["½", 0.5],
	["¼", 0.25],
	["¾", 0.75],
	["⅓", 0.33],
	["⅔", 0.66],
	["⅛", 0.125],
	["⅜", 0.375],
	["⅝", 0.625],
	["⅞", 0.875],
];

const FRACTION_TO_VALUE = new Map(FRACTIONS);
const VALUE_TO_GLYPH = new Map(
	FRACTIONS.filter(([glyph]) => glyph.length === 1).map(([glyph, value]) => [
		value,
		glyph,
	]),
);

export const ingredientSlug = (raw: string): string =>
	raw
		.normalize("NFKD")
		.replace(/\p{Mark}/gu, "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

export const convertQuantity = (
	value: number,
	fromUnit: string,
	toUnit: VolumeUnit,
): Quantity => {
	if (fromUnit === "oz" && toUnit === "ml") {
		return { amount: Math.round(value * ML_PER_OZ), unit: "ml" };
	}
	if (fromUnit === "ml" && toUnit === "oz") {
		return { amount: Math.round((value / ML_PER_OZ) * 100) / 100, unit: "oz" };
	}
	return { amount: value, unit: fromUnit };
};

export const parseQuantity = (quantity: string): Quantity => {
	const [head, ...rest] = quantity.split(" ");
	if (!head) return { amount: NaN, unit: "" };

	// Pattern A: "1 ½ oz" — integer, fraction glyph, then unit.
	if (rest[0] && FRACTION_TO_VALUE.has(rest[0])) {
		return {
			amount:
				(Number.parseFloat(head) || 0) + (FRACTION_TO_VALUE.get(rest[0]) ?? 0),
			unit: rest.slice(1).join(" "),
		};
	}

	// Pattern B: "1½ oz" — integer immediately followed by fraction glyph.
	const lastChar = head[head.length - 1];
	if (FRACTION_TO_VALUE.has(lastChar)) {
		return {
			amount:
				(Number.parseFloat(head.slice(0, -1)) || 0) +
				(FRACTION_TO_VALUE.get(lastChar) ?? 0),
			unit: rest.join(" "),
		};
	}

	// Pattern C: bare number or fraction.
	return {
		amount: FRACTION_TO_VALUE.get(head) ?? Number.parseFloat(head),
		unit: rest.join(" "),
	};
};

export const stringifyQuantity = (
	amountOrQuantity: number | Quantity,
	unit?: string,
): string => {
	const amount =
		typeof amountOrQuantity === "number"
			? amountOrQuantity
			: amountOrQuantity.amount;
	const resolvedUnit =
		typeof amountOrQuantity === "number" ? (unit ?? "") : amountOrQuantity.unit;

	if (!Number.isFinite(amount)) return resolvedUnit;

	const whole = Math.trunc(amount);
	const fraction = amount - whole;
	const glyph = VALUE_TO_GLYPH.get(Math.round(fraction * 1000) / 1000);

	const parts: string[] = [];
	if (whole !== 0 || !glyph) parts.push(String(whole));
	if (glyph) parts.push(glyph);
	if (resolvedUnit) parts.push(resolvedUnit);

	return parts.join(" ").trim();
};
