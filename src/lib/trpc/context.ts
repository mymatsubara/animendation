import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext(event: RequestEvent) {
	return async (fetchCtx: FetchCreateContextFnOptions) => ({
		event
	});
}

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
