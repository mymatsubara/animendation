import { dev } from '$app/environment';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { HandleServerError } from '@sveltejs/kit';
import { Toucan } from 'toucan-js';

// export const handle: Handle = async ({ event, resolve }) => {
// 	console.log({ url: event.url.toString() });

// 	return resolve(event);
// };

export const handleError: HandleServerError = async ({ error, event }) => {
	const is404 = (error as Error).message.startsWith('Not found:');

	if (!dev && !is404) {
		const context = event.platform?.context;

		const sentry = new Toucan({
			dsn: PUBLIC_SENTRY_DSN,
			request: event.request,
			environment: dev ? 'dev' : 'prod',
			context,
		});

		sentry.captureException(error);
	}

	return {
		message: (error as Error)?.message ?? 'Unexpected error',
	};
};
