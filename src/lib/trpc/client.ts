import { dev } from '$app/environment';
import type { AppRouter } from '$lib/trpc/router';
import { createTRPCProxyClient, httpLink, type CreateTRPCClientOptions } from '@trpc/client';

export const trpcConfig: CreateTRPCClientOptions<AppRouter> = {
	links: [
		httpLink({
			url: dev ? 'http://localhost:5173/api/trpc' : '/api/trpc'
		})
	]
};

export const trpc = createTRPCProxyClient(trpcConfig);
