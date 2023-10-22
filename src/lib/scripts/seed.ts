import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, isSequel } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';

export async function seed() {
	console.log('⏳ Starting database seeding...');

	try {
		await seedAnimes();
		await checkAnimesSequelRetry();
		console.log('✅ Database seeding completed!');
	} catch (e) {
		console.error('❌ Error while seeding database');
		console.error(e);
	}
}

async function seedAnimes() {
	let offset = 0;
	const limit = 500;
	const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });

	while (true) {
		console.log(`Ⓜ️  [Ranks: ${offset + 1}-${offset + limit}] Seeding animes from Myanimelist...`);

		const page = await client.getAnimeRaking({
			type: 'all',
			limit,
			offset
		});

		await db
			.insertInto('Anime')
			.values(
				page.animes.map((anime) => ({
					...anime,
					genres: anime.genres.join(',')
				}))
			)
			.onConflict((oc) =>
				oc.column('id').doUpdateSet(() => ({
					createdAt: ({ ref }) => ref('Anime.createdAt'),
					episodes: ({ ref }) => ref('Anime.episodes'),
					genres: ({ ref }) => ref('Anime.genres'),
					mediaType: ({ ref }) => ref('Anime.mediaType'),
					season: ({ ref }) => ref('Anime.season'),
					seasonYear: ({ ref }) => ref('Anime.seasonYear'),
					source: ({ ref }) => ref('Anime.source'),
					status: ({ ref }) => ref('Anime.status'),
					title: ({ ref }) => ref('Anime.title'),
					updatedAt: ({ ref }) => ref('Anime.updatedAt'),
					endDate: ({ ref }) => ref('Anime.endDate'),
					nsfw: ({ ref }) => ref('Anime.nsfw'),
					pictureLarge: ({ ref }) => ref('Anime.pictureLarge'),
					pictureMedium: ({ ref }) => ref('Anime.pictureMedium'),
					startDate: ({ ref }) => ref('Anime.startDate')
				}))
			)
			.execute();

		if (!page?.paging?.next) {
			break;
		}

		offset += limit;
	}
}

async function checkAnimesSequelRetry(maxRetries: number = 100) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			await checkAnimesSequel();
			break;
		} catch (e) {
			console.log('🔄️ Error. Retring...');
			console.error((e as any).message);
			await wait(10000);
		}
	}
}

async function checkAnimesSequel() {
	let sequelCheck = new Map<number, boolean>();
	const maxBackoff = 400;
	const checked = new Set<number>();
	const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });
	const animesNotChecked = await db
		.selectFrom('Anime')
		.select(['id'])
		.where('isSequel', 'is', null)
		.execute();

	let backoff = 0;
	for (const anime of animesNotChecked) {
		if (checked.has(anime.id)) {
			continue;
		}

		const animeDetails = await client.getAnimeDetailRaw(anime.id, 'related_anime');
		sequelCheck.set(anime.id, isSequel(animeDetails));
		checked.add(anime.id);

		const relatedSequels =
			animeDetails?.related_anime?.filter(
				({ relation_type }) => relation_type === 'sequel' || relation_type === 'side_story'
			) ?? [];

		for (const sequel of relatedSequels) {
			const id = sequel.node?.id;
			if (id) {
				sequelCheck.set(id, true);
				checked.add(id);
			}
		}

		console.log(`🎞️  [${checked.size}/${animesNotChecked.length}] Checking sequels...`);

		await wait(backoff);
		backoff = Math.min(backoff + 5, maxBackoff);

		const checksToSave = sequelCheck.size;
		if (checksToSave > 50) {
			console.log(`💾 Saving ${checksToSave} sequel checks to the database...`);

			const sequelIds = Object.entries(sequelCheck)
				.filter(([_, isSequel]) => isSequel)
				.map(([id, _]) => Number(id));
			await db
				.updateTable('Anime')
				.set({
					isSequel: 1
				})
				.where('id', 'in', sequelIds)
				.execute();

			const notSequelIds = Object.entries(sequelCheck)
				.filter(([_, isSequel]) => !isSequel)
				.map(([id, _]) => Number(id));
			await db
				.updateTable('Anime')
				.set({
					isSequel: 0
				})
				.where('id', 'in', notSequelIds)
				.execute();

			sequelCheck.clear();
		}
	}
}

async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

seed();
