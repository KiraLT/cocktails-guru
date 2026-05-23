export function ingredientSlug(raw: string): string {
	return raw
		.normalize("NFKD")
		.replace(/\p{Mark}/gu, "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export type VolumeUnit = "oz" | "ml";

const ML_PER_OZ = 30;

export function convertQuantity(
	value: number,
	fromUnit: string,
	toUnit: VolumeUnit,
): [number, string] {
	if (fromUnit === "oz" && toUnit === "ml") {
		return [Math.round(value * ML_PER_OZ), "ml"];
	}
	if (fromUnit === "ml" && toUnit === "oz") {
		return [Math.round((value / ML_PER_OZ) * 100) / 100, "oz"];
	}
	return [value, fromUnit];
}

const specialNumbers: Record<string, number> = {
	"1/2": 0.5,
	"1/4": 0.25,
	"3/4": 0.75,
	"1/3": 0.33,
	"2/3": 0.66,
	"1/8": 0.125,
	"3/8": 0.375,
	"5/8": 0.625,
	"7/8": 0.875,
	"½": 0.5,
	"¼": 0.25,
	"¾": 0.75,
	"⅓": 0.33,
	"⅔": 0.66,
	"⅛": 0.125,
	"⅜": 0.375,
	"⅝": 0.625,
	"⅞": 0.875,
};

export function parseQuantity(quantity: string): [number, string] {
	const [amount, ...parts] = quantity.split(" ");
	const amountLastChar = amount[amount.length - 1];

	if (parts[0] in specialNumbers) {
		return [
			(parseFloat(amount) || 0) + specialNumbers[parts[0]],
			parts.slice(1).join(" "),
		];
	}

	if (amountLastChar in specialNumbers) {
		return [
			(parseFloat(amount.slice(0, -1)) || 0) + specialNumbers[amountLastChar],
			parts.join(" "),
		];
	}

	return [parseFloat(amount), parts.join(" ")];
}

export function stringifyQuantity(amount: number, unit: string): string {
	const digits = amount % 1;
	const rounded = Math.trunc(amount);

	const specialNumber = Object.entries(specialNumbers).find(
		([, value]) => value === digits,
	);

	if (specialNumber) {
		return `${rounded || ""} ${specialNumber[0]} ${unit}`;
	}

	return `${amount} ${unit}`;
}
