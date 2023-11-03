import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { createContext } from '$lib/trpc/context';
import { appRouter } from '$lib/trpc/router';
import type { RequestHandler } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { Toucan } from 'toucan-js';

const handle: RequestHandler = async (event) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req: event.request,
		createContext: createContext(event),
		onError: ({ error, input, path, ctx }) => {
			if (error.code === 'INTERNAL_SERVER_ERROR') {
				console.log('❌ Unexpected server error');
				console.error(error);

				if (ctx?.event?.platform?.context) {
					const sentry = new Toucan({
						dsn: PUBLIC_SENTRY_DSN,
						request: event.request,
						environment: 'prod',
						context: ctx.event.platform.context
					});

					sentry.captureException(error, {
						data: {
							input,
							path
						}
					});
				}
			}
		}
	});
};

export const GET = handle;
export const POST = handle;
