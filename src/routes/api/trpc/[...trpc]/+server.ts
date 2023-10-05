import { createContext } from '$lib/trpc/context';
import { appRouter } from '$lib/trpc/router';
import type { RequestHandler } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handle: RequestHandler = async (event) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req: event.request,
		createContext: createContext(event)
	});
};

export const GET = handle;
export const POST = handle;
