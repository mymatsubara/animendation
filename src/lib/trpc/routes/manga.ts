import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, type MangaDetail } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { TRPCError, type inferAsyncReturnType } from '@trpc/server';
import { z } from 'zod';

export const mangaRoute = router({
	info: publicProcedure
		.input(
			z.object({
				ids: z.coerce.number().int().positive().array(),
			})
		)
		.mutation(async ({ input }) => {
			let mangas = await getMangaInfo(input.ids);

			// Fetch new mangas from the MAL api
			if (mangas.length !== input.ids.length) {
				const idsInDb = new Set(mangas.map((manga) => manga.id));
				const newIds = input.ids.filter((id) => !idsInDb.has(id));
				const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });

				const newMangas: MangaDetail[] = [];

				// Request are not made in parallel to avoid get rate limited by MAL api
				for (let newId of newIds) {
					try {
						newMangas.push(await client.getMangaDetail(newId));
					} catch (e) {
						const notFound = e instanceof TRPCError && e.code === 'NOT_FOUND';

						if (!notFound) {
							throw e;
						}
					}
				}

				if (newMangas.length > 0) {
					await db
						.insertInto('Manga')
						.values(
							newMangas.map((anime) => ({
								...anime,
								genres: anime.genres.join(','),
							}))
						)
						.execute();
				}

				mangas = mangas.concat(
					newMangas.map((manga) => ({
						...manga,
						endDate: manga.endDate ?? null,
						nsfw: manga.nsfw ?? null,
						pictureLarge: manga.pictureLarge ?? null,
						pictureMedium: manga.pictureMedium ?? null,
						startDate: manga.startDate ?? null,
						volumes: manga.volumes ?? null,
						chapters: manga.chapters ?? null,
					}))
				);
			}

			return mangas;
		}),
	feed: authProcedure
		.input(
			z.object({
				offset: z.number().finite().positive().default(0),
				limit: z.number().finite().positive().default(10),
			})
		)
		.query(async ({ input, ctx }) => {
			return db
				.selectFrom('MangaRecommendation')
				.innerJoin('Follower', (join) =>
					join
						.on('Follower.userId', '=', ctx.user.userId)
						.onRef('Follower.followedUserId', '=', 'MangaRecommendation.userId')
				)
				.innerJoin('User', 'User.id', 'MangaRecommendation.userId')
				.innerJoin('Manga', 'Manga.id', 'MangaRecommendation.animeId')
				.select([
					'User.name as username',
					'Manga.title',
					'Manga.pictureLarge',
					'MangaRecommendation.createdAt',
					'Manga.id as serieId',
				])
				.limit(input.limit)
				.offset(input.offset)
				.orderBy('MangaRecommendation.createdAt desc')
				.execute();
		}),
});

export type MangaInfo = inferAsyncReturnType<typeof getMangaInfo>[number];

async function getMangaInfo(ids: number[]) {
	const animes = await db
		.selectFrom('Manga')
		.select(['id', 'title', 'mediaType', 'nsfw', 'genres', 'pictureLarge', 'chapters', 'volumes'])
		.where('id', 'in', ids)
		.execute();

	return animes.map((anime) => ({
		...anime,
		genres: anime.genres.split(','),
	}));
}
