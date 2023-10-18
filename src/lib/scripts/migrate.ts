import { db as origDb } from '$lib/server/db';
import { groupBy } from '$lib/utils/array';
import fs from 'fs/promises';
import { sql } from 'kysely';
import path from 'path';

type Migration = {
	name: string;
	timestamp: string;
	executedAt: string;
};

const migrationTable = '__migrations';

type MigrationDb = {
	[migrationTable]: Migration;
};

const db = origDb.withTables<MigrationDb>();

async function migrate() {
	console.log('⏳ Starting database migration...');
	await db.schema
		.createTable(migrationTable)
		.ifNotExists()
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('timestamp', 'text', (col) => col.notNull())
		.addColumn('executedAt', 'datetime', (col) => col.notNull())
		.execute();

	const executedMigrations = await db
		.withTables<MigrationDb>()
		.selectFrom(migrationTable)
		.selectAll()
		.orderBy('timestamp', 'desc')
		.execute();
	const executedMigrationByTimestamp = groupBy(
		executedMigrations,
		(migration) => migration.timestamp
	);

	try {
		const migrationsDir = path.join(__dirname, '../../../prisma/migrations');
		const migrations = (await fs.readdir(migrationsDir))
			.filter((file) => !path.extname(file))
			.map((dir) => path.join(migrationsDir, dir))
			.map((dirPath) => {
				const dirName = path.basename(dirPath);
				const [timestamp, ...name] = dirName.split('_');

				return {
					timestamp,
					name: name.join('_'),
					path: path.join(dirPath, 'migration.sql')
				};
			});

		// Get all new migrations
		const newMigrations = migrations.filter(
			(migration) => !executedMigrationByTimestamp[migration.timestamp]
		);

		console.log(`\n${newMigrations.length} migrations pending...`);

		for (let migration of newMigrations) {
			console.log(`⏳ Executing database migration: "${migration.name}"`);

			const sqlMigration = await fs.readFile(migration.path, { encoding: 'utf-8' });
			const statements = sqlMigration.split(';');

			for (const statement of statements) {
				try {
					await sql.raw(statement).execute(db);
				} catch (e) {
					if ((e as any).code !== 'SQL_NO_STATEMENT') {
						throw e;
					}
				}
			}

			await db
				.insertInto(migrationTable)
				.values({
					name: migration.name,
					timestamp: migration.timestamp,
					executedAt: new Date().toISOString()
				})
				.execute();

			console.log(`✅ Migration executed: "${migration.name}"`);
		}
	} catch (e) {
		console.error(
			'\n❌ Error while executing migrations. All executed migrations were rolled back.\n'
		);
		throw e;
	}

	console.log('\n✅ Database migration completed!');
}

migrate();
