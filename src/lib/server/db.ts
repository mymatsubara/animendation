import { env } from '$env/dynamic/private';
import type { DB } from '$lib/server/schema';
import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

export const db = new Kysely<DB>({
	dialect: new PlanetScaleDialect({
		url: env.DATABASE_URL,

		// Make sure cloudflare does not cache planetscale responses
		fetch: (input, init) => {
			if (init?.cache) {
				delete init.cache;
				init.headers['Cache-Control'] = ' no-store, no-cache, must-revalidate, max-age=0';
				init.headers['Pragma'] = 'no-cache';
			}

			return fetch(input, init);
		}
	})
});
