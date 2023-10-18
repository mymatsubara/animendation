import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, type AnimeDetail } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { TRPCError, type inferAsyncReturnType } from '@trpc/server';
import { z } from 'zod';

export const animeRoute = router({
	info: publicProcedure
		.input(
			z.object({
				ids: z.coerce.number().int().positive().array()
			})
		)
		.mutation(async ({ input }) => {
			let animes = await getAnimesInfo(input.ids);

			// Fetch new animes from the MAL api
			if (animes.length !== input.ids.length) {
				const idsInDb = new Set(animes.map((anime) => anime.id));
				const newIds = input.ids.filter((id) => !idsInDb.has(id));
				const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });

				console.log({ newIds });

				const newAnimes: AnimeDetail[] = [];

				// Request are not made in parallel to avoid get rate limited by MAL api
				for (let newId of newIds) {
					try {
						newAnimes.push(await client.getAnimeDetail(newId));
					} catch (e) {
						const notFound = e instanceof TRPCError && e.code === 'NOT_FOUND';

						if (!notFound) {
							throw e;
						}
					}
				}

				if (newAnimes.length > 0) {
					await db
						.insertInto('Anime')
						.values(
							newAnimes.map((anime) => ({
								...anime,
								genres: anime.genres.join(',')
							}))
						)
						.execute();
				}

				animes = animes.concat(newAnimes);
			}

			return animes;
		})
});

export type AnimeInfo = inferAsyncReturnType<typeof getAnimesInfo>[number];

async function getAnimesInfo(ids: number[]) {
	const animes = await db
		.selectFrom('Anime')
		.select(['id', 'title', 'mediaType', 'season', 'seasonYear', 'nsfw', 'genres', 'pictureMedium'])
		.where('id', 'in', ids)
		.execute();

	return animes.map((anime) => ({
		...anime,
		genres: anime.genres.split(',')
	}));
}