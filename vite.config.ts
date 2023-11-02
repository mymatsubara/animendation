import { sentryVitePlugin } from '@sentry/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	if (mode === 'cloudflare') {
		const env = loadEnv(mode, process.cwd(), '');

		return {
			build: {
				sourcemap: true
			},
			plugins: [
				sentryVitePlugin({
					org: 'freelancer-webdevelopment',
					project: 'animendation',

					// Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
					// and need `project:releases` and `org:read` scopes
					authToken: env.SENTRY_AUTH_TOKEN
				}),
				sveltekit()
			]
		};
	} else {
		return {
			plugins: [sveltekit()]
		};
	}
});
