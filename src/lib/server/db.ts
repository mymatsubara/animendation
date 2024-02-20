import { env } from '$env/dynamic/private';
import type { DB } from '$lib/server/schema';
import { Kysely, SqliteDialect } from 'kysely';
import { D1Dialect } from 'kysely-d1';

let sqliteDb: Kysely<DB>;
let d1Db: Kysely<DB>;

export async function getDb(platform?: App.Platform) {
	const d1Env = platform?.env?.DB;

	if (!d1Env) {
		if (import.meta.env.DEV) {
			const { default: Database } = await import('better-sqlite3');
			const path = env.DATABASE_URL.replace('file:./', './prisma/');

			if (!sqliteDb) {
				sqliteDb = new Kysely<DB>({
					dialect: new SqliteDialect({
						database: new Database(path),
					}),
				});
			}

			return sqliteDb;
		}
	} else {
		d1Db = new Kysely<DB>({
			dialect: new D1Dialect({ database: d1Env }),
		});
	}

	return d1Db;
}
