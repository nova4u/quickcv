/// <reference types="vite/client" />

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module "*?raw" {
	const content: string;
	export default content;
}

declare module "*.css" {
	const content: string;
	export default content;
}
