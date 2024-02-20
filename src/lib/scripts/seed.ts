import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, isSequel } from '$lib/clients/myanimelist';
import { getDb } from '$lib/server/db';
import type { SerieType } from '$lib/types';
import { sql } from 'kysely';

export async function seed(type: 'animes' | 'mangas' | 'all') {
	console.log('⏳ Starting database seeding...');

	try {
		if (type === 'animes' || type === 'all') {
			await seedSeries('Anime');
			await checkAnimesSequelRetry();
		}

		if (type === 'mangas' || type === 'all') {
			await seedSeries('Manga');
		}

		console.log('✅ Database seeding completed!');
	} catch (e) {
		console.error('❌ Error while seeding database');
		console.error(e);

		if (process) {
			process.exit(1);
		}
	}
}

async function seedSeries(type: SerieType) {
	let offset = 0;
	const limit = 500;
	const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });
	const db = await getDb();

	while (true) {
		console.log(
			`Ⓜ️  [Ranks: ${offset + 1}-${
				offset + limit
			}] Seeding ${type.toLocaleLowerCase()}s from Myanimelist...`
		);

		if (type === 'Anime') {
			const page = await client.getAnimeRaking({
				type: 'all',
				limit,
				offset,
			});

			await db
				.insertInto(type)
				.values(
					page.mangas.map((anime) => ({
						...anime,
						genres: anime.genres.join(','),
					}))
				)
				.onConflict((oc) =>
					oc.column('id').doUpdateSet({
						createdAt: ({ ref }) => ref('createdAt'),
						genres: ({ ref }) => ref('genres'),
						mediaType: ({ ref }) => ref('mediaType'),
						status: ({ ref }) => ref('status'),
						title: ({ ref }) => ref('title'),
						updatedAt: ({ ref }) => ref('updatedAt'),
						endDate: ({ ref }) => ref('endDate'),
						nsfw: ({ ref }) => ref('nsfw'),
						pictureLarge: ({ ref }) => ref('pictureLarge'),
						pictureMedium: ({ ref }) => ref('pictureMedium'),
						startDate: ({ ref }) => ref('startDate'),
						episodes: ({ ref }) => ref('episodes'),
						season: ({ ref }) => ref('season'),
						seasonYear: ({ ref }) => ref('seasonYear'),
						source: ({ ref }) => ref('source'),
						largePictureUpdatedAt: ({ ref }) =>
							sql`CASE WHEN ${ref('pictureLarge')} = ${ref('pictureLarge')} THEN ${ref(
								'largePictureUpdatedAt'
							)} ELSE NOW() END`,
					})
				)
				.execute();

			if (!page?.paging?.next) {
				break;
			}
		} else if (type === 'Manga') {
			const page = await client.getMangaRanking({
				type: 'all',
				limit,
				offset,
			});

			await db
				.insertInto(type)
				.values(
					page.mangas.map((manga) => ({
						...manga,
						genres: manga.genres.join(','),
					}))
				)
				.onConflict((oc) =>
					oc.column('id').doUpdateSet({
						createdAt: ({ ref }) => ref('createdAt'),
						genres: ({ ref }) => ref('genres'),
						mediaType: ({ ref }) => ref('mediaType'),
						status: ({ ref }) => ref('status'),
						title: ({ ref }) => ref('title'),
						updatedAt: ({ ref }) => ref('updatedAt'),
						endDate: ({ ref }) => ref('endDate'),
						nsfw: ({ ref }) => ref('nsfw'),
						pictureLarge: ({ ref }) => ref('pictureLarge'),
						pictureMedium: ({ ref }) => ref('pictureMedium'),
						startDate: ({ ref }) => ref('startDate'),
						chapters: ({ ref }) => ref('chapters'),
						volumes: ({ ref }) => ref('volumes'),
						largePictureUpdatedAt: ({ ref }) =>
							sql`CASE WHEN ${ref('pictureLarge')} = ${ref('pictureLarge')} THEN ${ref(
								'largePictureUpdatedAt'
							)} ELSE NOW() END`,
					})
				)
				.execute();

			if (!page?.paging?.next) {
				break;
			}
		}

		offset += limit;
	}
}

async function checkAnimesSequelRetry(maxRetries: number = 100) {
	const db = getDb();
	for (let i = 0; i < maxRetries; i++) {
		try {
			await checkAnimesSequel();
			break;
		} catch (e) {
			console.log('🔄️ Error. Retring...', e);
			console.error((e as any).message);
			await wait(10000);
		}
	}
}

async function checkAnimesSequel() {
	const db = await getDb();
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

		if (sequelCheck.size > 50) {
			saveSequelChecks(sequelCheck);
			sequelCheck.clear();
		}
	}

	saveSequelChecks(sequelCheck);
}

async function saveSequelChecks(sequelCheck: Map<number, boolean>) {
	const db = await getDb();
	const checksToSave = sequelCheck.size;
	console.log(`💾 Saving ${checksToSave} sequel checks to the database...`);

	const sequelIds = [...sequelCheck.entries()]
		.filter(([_, isSequel]) => isSequel)
		.map(([id, _]) => Number(id));
	if (sequelIds.length) {
		await db
			.updateTable('Anime')
			.set({
				isSequel: 1,
			})
			.where('id', 'in', sequelIds)
			.execute();
	}

	const notSequelIds = [...sequelCheck.entries()]
		.filter(([_, isSequel]) => !isSequel)
		.map(([id, _]) => Number(id));
	if (notSequelIds.length) {
		await db
			.updateTable('Anime')
			.set({
				isSequel: 0,
			})
			.where('id', 'in', notSequelIds)
			.execute();
	}
}

async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
