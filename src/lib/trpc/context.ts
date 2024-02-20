import { getDb } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext(event: RequestEvent) {
	return async (fetchCtx: FetchCreateContextFnOptions) => ({
		event,
		db: await getDb(event.platform),
	});
}

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
