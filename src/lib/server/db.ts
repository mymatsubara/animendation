import { env } from '$env/dynamic/private';
import type { DB } from '$lib/server/schema';
import { Kysely } from 'kysely';
import { NeonHTTPDialect } from 'kysely-neon';

export const db = new Kysely<DB>({
	dialect: new NeonHTTPDialect({
		connectionString: env.DATABASE_URL
	})
});
