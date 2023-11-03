import { env } from '$env/dynamic/private';
import type { DB } from '$lib/server/schema';
// import { createClient } from '@libsql/client';
import { LibsqlDialect, hrana } from '@libsql/kysely-libsql';
import { Kysely } from 'kysely';

const client = hrana.openHttp(
	env.DATABASE_URL,
	env.DATABASE_AUTH_TOKEN,
	(input: string, init: any) => {
		if (init?.cache) {
			delete init.cache;
			init.headers['Cache-Control'] = ' no-store, no-cache, must-revalidate, max-age=0';
			init.headers['Pragma'] = 'no-cache';
		}

		return fetch(input, init);
	}
);

export const db = new Kysely<DB>({
	dialect: new LibsqlDialect({
		client
	})
});
