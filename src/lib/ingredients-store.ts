import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VolumeUnit } from "@/lib/ingredients-utils";

export type Scale = 1 | 2 | 3 | 4;

export const useIngredientsStore = create(
	persist<{
		units: VolumeUnit;
		scale: Scale;
		setUnits: (units: VolumeUnit) => void;
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
