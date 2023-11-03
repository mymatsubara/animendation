import { dev } from '$app/environment';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { Replay } from '@sentry/sveltekit';
import { TRPCClientError } from '@trpc/client';

if (!dev) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1.0,

		// This sets the sample rate to be 10%. You may want this to be 100% while
		// in development and sample at a lower rate in production
		replaysSessionSampleRate: 0.1,

		// If the entire session is not sampled, use the below sample rate to sample
		// sessions when an error occurs.
		replaysOnErrorSampleRate: 1.0,

		// If you don't want to use Session Replay, just remove the line below:
		integrations: [new Replay()],
		environment: dev ? 'dev' : 'prod'
	});

	window.addEventListener('unhandledrejection', (event) => {
		if (
			event.reason instanceof TRPCClientError &&
			event.reason.data.code === 'INTERNAL_SERVER_ERROR'
		) {
			return;
		}

		Sentry.captureException(event.reason);
	});
}
