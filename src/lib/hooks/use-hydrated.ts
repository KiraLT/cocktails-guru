import { useEffect, useState } from "react";

/**
 * Returns true after the component has mounted on the client.
 *
 * Use this when SSR output must use deterministic defaults but the
 * post-hydration render can use browser-only state (localStorage, window).
 */
export function useHydrated(): boolean {
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);
	return hydrated;
}
