import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dedupeLists, LIST_STORAGE_KEY, type List } from "@/lib/list";

interface ListsState {
	lists: List[];
	upsert: (list: List, previousName?: string) => void;
	remove: (name: string) => void;
}

export const useListsStore = create(
	persist<ListsState>(
		(set) => ({
			lists: [],
			upsert: (list, previousName) =>
				set((state) => ({
					lists: dedupeLists([
						...state.lists.filter(
							(l) => l.name !== (previousName ?? list.name),
						),
						list,
					]),
				})),
			remove: (name) =>
				set((state) => ({
					lists: state.lists.filter((l) => l.name !== name),
				})),
		}),
		{
			name: LIST_STORAGE_KEY,
			// Persist the legacy schema (a raw List[] under "my-lists") for
			// backwards compatibility with users' existing localStorage.
			storage: {
				getItem: (key) => {
					if (typeof window === "undefined") return null;
					const raw = window.localStorage.getItem(key);
					if (!raw) return null;
					try {
						const parsed = JSON.parse(raw);
						const lists: List[] = Array.isArray(parsed)
							? parsed
							: (parsed?.state?.lists ?? []);
						return { state: { lists: dedupeLists(lists) }, version: 0 };
					} catch {
						return null;
					}
				},
				setItem: (key, value) => {
					if (typeof window === "undefined") return;
					const lists = value?.state?.lists ?? [];
					window.localStorage.setItem(key, JSON.stringify(dedupeLists(lists)));
				},
				removeItem: (key) => {
					if (typeof window === "undefined") return;
					window.localStorage.removeItem(key);
				},
			},
		},
	),
);
