import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, type AnimeDetail } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { TRPCError, type inferAsyncReturnType } from '@trpc/server';
import { z } from 'zod';

export const animeRoute = router({
	info: publicProcedure
		.input(
			z.object({
				ids: z.coerce.number().int().positive().array(),
			})
		)
		.mutation(async ({ input }) => {
			let animes = await getAnimesInfo(input.ids);

			// Fetch new animes from the MAL api
			if (animes.length !== input.ids.length) {
				const idsInDb = new Set(animes.map((anime) => anime.id));
				const newIds = input.ids.filter((id) => !idsInDb.has(id));
				const client = new MALClient({ clientId: PUBLIC_MAL_CLIENT_ID });

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
								genres: anime.genres.join(','),
								isSequel: anime.isSequel ? 1 : 0,
							}))
						)
						.execute();
				}

				animes = animes.concat(
					newAnimes.map((anime) => ({
						...anime,
						isSequel: anime.isSequel ? 1 : 0,
						endDate: anime.endDate ?? null,
						nsfw: anime.nsfw ?? null,
						pictureLarge: anime.pictureLarge ?? null,
						pictureMedium: anime.pictureMedium ?? null,
						season: anime.season ?? null,
						seasonYear: anime.seasonYear ?? null,
						source: anime.source ?? null,
						startDate: anime.startDate ?? null,
					}))
				);
			}

			return animes;
		}),
	feed: authProcedure
		.input(
			z.object({
				offset: z.number().finite().min(0).default(0),
				limit: z.number().finite().positive().default(10),
			})
		)
		.query(async ({ input, ctx }) => {
			return db
				.selectFrom('AnimeRecommendation')
				.innerJoin('Follower', (join) =>
					join
						.on('Follower.userId', '=', ctx.user.userId)
						.onRef('Follower.followedUserId', '=', 'AnimeRecommendation.userId')
				)
				.innerJoin('User', 'User.id', 'AnimeRecommendation.userId')
				.innerJoin('Anime', 'Anime.id', 'AnimeRecommendation.animeId')
				.select([
					'User.name as username',
					'Anime.title',
					'Anime.pictureLarge',
					'AnimeRecommendation.createdAt',
					'Anime.id as serieId',
				])
				.limit(input.limit)
				.offset(input.offset)
				.orderBy('AnimeRecommendation.createdAt desc')
				.execute();
		}),
});

export type AnimeInfo = inferAsyncReturnType<typeof getAnimesInfo>[number];

async function getAnimesInfo(ids: number[]) {
	const animes = await db
		.selectFrom('Anime')
		.select([
			'id',
			'title',
			'mediaType',
			'season',
			'seasonYear',
			'nsfw',
			'genres',
			'pictureLarge',
			'isSequel',
		])
		.where('id', 'in', ids)
		.execute();

	return animes.map((anime) => ({
		...anime,
		genres: anime.genres.split(','),
	}));
}
