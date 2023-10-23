import type { AppRouter } from '$lib/trpc/router';
import { createTRPCProxyClient, httpLink, type CreateTRPCClientOptions } from '@trpc/client';

export const trpcConfig: CreateTRPCClientOptions<AppRouter> = {
	links: [
		httpLink({
			url: '/api/trpc'
		})
	]
};

export const trpc = createTRPCProxyClient(trpcConfig);
