import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';

export async function seed() {
	console.log('⏳ Starting database seeding...');

	try {
		await seedAnimes();
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
			.values(page.animes)
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

seed();
