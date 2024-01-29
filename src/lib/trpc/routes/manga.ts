import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { MALClient, type MangaDetail } from '$lib/clients/myanimelist';
import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import type { PaginatedData } from '$lib/trpc/types';
import { isDateValid } from '$lib/utils/date';
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
			let mangas = await getMangaInfo({ ids: input.ids });

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

	withPictureUpdated: authProcedure
		.input(
			z.object({
				since: z.string().min(1),
			})
		)
		.query(async ({ input }) => {
			const pictureModifiedSince = new Date(input.since);

			if (!isDateValid(pictureModifiedSince)) {
				return [];
			}

			return getMangaInfo({ pictureModifiedSince });
		}),
	feed: authProcedure
		.input(
			z.object({
				limit: z.number().finite().positive().default(10),
				nextPageToken: z.number().optional(),
			})
		)
		.query(async ({ input, ctx }) => {
			const data = await db
				.selectFrom('MangaRecommendation')
				.innerJoin('Follower', (join) =>
					join
						.on('Follower.userId', '=', ctx.user.userId)
						.onRef('Follower.followedUserId', '=', 'MangaRecommendation.userId')
				)
				.innerJoin('User', 'User.id', 'MangaRecommendation.userId')
				.innerJoin('Manga', 'Manga.id', 'MangaRecommendation.animeId')
				.select([
					'MangaRecommendation.id',
					'User.name as username',
					'Manga.title',
					'Manga.pictureLarge',
					'MangaRecommendation.createdAt',
					'Manga.id as serieId',
				])
				.orderBy('MangaRecommendation.id desc')
				.$if(input.nextPageToken !== undefined, (qb) =>
					qb.where('MangaRecommendation.id', '<', input.nextPageToken as number)
				)
				.limit(input.limit)
				.execute();

			const result: PaginatedData<typeof data[number]> = {
				data,
				hasNextPage: data.length >= input.limit,
				nextPageToken: data.at(-1)?.id ?? 0,
			};

			return result;
		}),
});

export type MangaInfo = inferAsyncReturnType<typeof getMangaInfo>[number];

type Filter = {
	ids?: number[];
	pictureModifiedSince?: Date;
};

async function getMangaInfo(filter?: Filter) {
	const animes = await db
		.selectFrom('Manga')
		.select(['id', 'title', 'mediaType', 'nsfw', 'genres', 'pictureLarge', 'chapters', 'volumes'])
		.$if(!!filter?.ids, (qb) => qb.where('id', 'in', filter?.ids as number[]))
		.$if(!!filter?.pictureModifiedSince, (qb) =>
			qb
				.where('largePictureUpdatedAt', '>=', filter?.pictureModifiedSince as Date)
				.where('createdAt', '<=', filter?.pictureModifiedSince as Date)
		)
		.execute();

	return animes.map((anime) => ({
		...anime,
		genres: anime.genres.split(','),
	}));
}
