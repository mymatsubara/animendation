import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';
import type { Anime } from '$lib/server/schema';
import { publicProcedure, router } from '$lib/trpc';
import { TRPCError, type inferAsyncReturnType } from '@trpc/server';
import type { Insertable } from 'kysely';
import { z } from 'zod';

export const animeRoute = router({
	info: publicProcedure
		.input(
			z.object({
				ids: z.number().int().positive().array()
			})
		)
		.query(async ({ input }) => {
			let animes = await getAnimesInfo(input.ids);

			// Fetch new animes from the MAL api
			if (animes.length !== input.ids.length) {
				const idsInDb = new Set(animes.map((anime) => anime.id));
				const newIds = input.ids.filter((id) => !idsInDb.has(id));
				const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });

				const newAnimes: Insertable<Anime>[] = [];

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
					await db.insertInto('Anime').values(newAnimes).execute();
				}

				animes = animes.concat(newAnimes as AnimeInfo[]);
			}

			return animes;
		})
});

export type AnimeInfo = inferAsyncReturnType<typeof getAnimesInfo>[number];

function getAnimesInfo(ids: number[]) {
	return db
		.selectFrom('Anime')
		.select(['id', 'title', 'mediaType', 'season', 'seasonYear', 'nsfw', 'genres', 'pictureMedium'])
		.where('id', 'in', ids)
		.execute();
}
