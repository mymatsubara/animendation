import { env } from '$env/dynamic/private';
import type { DB } from '$lib/server/schema';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { Kysely } from 'kysely';

export const db = new Kysely<DB>({
	dialect: new LibsqlDialect({
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN
	})
});
