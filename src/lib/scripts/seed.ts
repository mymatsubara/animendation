import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, isSequel } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';
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
				.onDuplicateKeyUpdate({
					createdAt: ({ ref }) => sql`VALUES(${ref('createdAt')})`,
					genres: ({ ref }) => sql`VALUES(${ref('genres')})`,
					mediaType: ({ ref }) => sql`VALUES(${ref('mediaType')})`,
					status: ({ ref }) => sql`VALUES(${ref('status')})`,
					title: ({ ref }) => sql`VALUES(${ref('title')})`,
					updatedAt: ({ ref }) => sql`VALUES(${ref('updatedAt')})`,
					endDate: ({ ref }) => sql`VALUES(${ref('endDate')})`,
					nsfw: ({ ref }) => sql`VALUES(${ref('nsfw')})`,
					pictureLarge: ({ ref }) => sql`VALUES(${ref('pictureLarge')})`,
					pictureMedium: ({ ref }) => sql`VALUES(${ref('pictureMedium')})`,
					startDate: ({ ref }) => sql`VALUES(${ref('startDate')})`,
					episodes: ({ ref }) => sql`VALUES(${ref('episodes')})`,
					season: ({ ref }) => sql`VALUES(${ref('season')})`,
					seasonYear: ({ ref }) => sql`VALUES(${ref('seasonYear')})`,
					source: ({ ref }) => sql`VALUES(${ref('source')})`,
				})
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
				.onDuplicateKeyUpdate({
					createdAt: ({ ref }) => sql`VALUES(${ref('createdAt')})`,
					genres: ({ ref }) => sql`VALUES(${ref('genres')})`,
					mediaType: ({ ref }) => sql`VALUES(${ref('mediaType')})`,
					status: ({ ref }) => sql`VALUES(${ref('status')})`,
					title: ({ ref }) => sql`VALUES(${ref('title')})`,
					updatedAt: ({ ref }) => sql`VALUES(${ref('updatedAt')})`,
					endDate: ({ ref }) => sql`VALUES(${ref('endDate')})`,
					nsfw: ({ ref }) => sql`VALUES(${ref('nsfw')})`,
					pictureLarge: ({ ref }) => sql`VALUES(${ref('pictureLarge')})`,
					pictureMedium: ({ ref }) => sql`VALUES(${ref('pictureMedium')})`,
					startDate: ({ ref }) => sql`VALUES(${ref('startDate')})`,
					chapters: ({ ref }) => sql`VALUES(${ref('chapters')})`,
					volumes: ({ ref }) => sql`VALUES(${ref('volumes')})`,
				})
				.execute();

			if (!page?.paging?.next) {
				break;
			}
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
			console.log('🔄️ Error. Retring...', e);
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

		if (sequelCheck.size > 50) {
			saveSequelChecks(sequelCheck);
			sequelCheck.clear();
		}
	}

	saveSequelChecks(sequelCheck);
}

async function saveSequelChecks(sequelCheck: Map<number, boolean>) {
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
