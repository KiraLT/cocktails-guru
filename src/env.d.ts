/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react/experimental" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL?: string;
	readonly PUBLIC_GA_ID?: string;
	readonly PUBLIC_DISQUS_NAME?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
