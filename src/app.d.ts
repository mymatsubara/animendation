/// <reference types="@cloudflare/workers-types" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			env: {
				// KV: KVNamespace;
				DB: D1Database;
			};
			context: ExecutionContext;
		}
	}
}

export {};
