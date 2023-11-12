import { showErrorToUser } from '$lib/trpc/client/links';
import type { AppRouter } from '$lib/trpc/router';
import { createTRPCProxyClient, httpLink, type CreateTRPCClientOptions } from '@trpc/client';

export const trpcConfig: CreateTRPCClientOptions<AppRouter> = {
	links: [
		showErrorToUser,
		httpLink({
			url: '/api/trpc',
		}),
	],
};

export const trpc = createTRPCProxyClient(trpcConfig);
