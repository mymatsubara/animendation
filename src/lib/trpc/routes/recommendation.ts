import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { serieTypes } from '$lib/types';
import { z } from 'zod';

export const recommendationRoute = router({
	list: publicProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.query(async ({ input }) => {
			const animeRecommendations = db
				.selectFrom('AnimeRecommendation')
				.select(['animeId'])
				.where('userId', '=', (qb) =>
					qb.selectFrom('User').select(['id']).where('name', '=', input.username)
				)
				.orderBy('createdAt desc')
				.execute();

			const mangaRecommendations = db
				.selectFrom('MangaRecommendation')
				.select(['mangaId'])
				.where('userId', '=', (qb) =>
					qb.selectFrom('User').select(['id']).where('name', '=', input.username)
				)
				.orderBy('createdAt desc')
				.execute();

			return {
				animes: (await animeRecommendations).map((anime) => anime.animeId),
				mangas: (await mangaRecommendations).map((manga) => manga.mangaId),
			};
		}),
	mine: authProcedure.query(async ({ ctx, input }) => {
		const animeRecommendations = db
			.selectFrom('AnimeRecommendation')
			.select(['animeId'])
			.where('userId', '=', ctx.user.userId)
			.orderBy('createdAt desc')
			.execute();

		const mangaRecommendations = db
			.selectFrom('MangaRecommendation')
			.select(['mangaId'])
			.where('userId', '=', ctx.user.userId)
			.orderBy('createdAt desc')
			.execute();

		return {
			animes: (await animeRecommendations).map((anime) => anime.animeId),
			mangas: (await mangaRecommendations).map((manga) => manga.mangaId),
		};
	}),
	add: authProcedure
		.input(
			z.object({
				serieId: z.number().int().positive(),
				type: z.enum(serieTypes),
			})
		)
		.mutation(async ({ input, ctx }) => {
			if (input.type === 'Anime') {
				await db
					.insertInto(`AnimeRecommendation`)
					.values({
						userId: ctx.user.userId,
						animeId: input.serieId,
					})
					.execute();
			} else {
				await db
					.insertInto(`MangaRecommendation`)
					.values({
						userId: ctx.user.userId,
						mangaId: input.serieId,
					})
					.execute();
			}
		}),
	remove: authProcedure
		.input(
			z.object({
				serieId: z.number().int().positive(),
				type: z.enum(serieTypes),
			})
		)
		.mutation(async ({ input, ctx }) => {
			await db
				.deleteFrom(`${input.type}Recommendation`)
				.where(input.type === 'Anime' ? 'animeId' : 'mangaId', '=', input.serieId)
				.where('userId', '=', ctx.user.userId)
				.execute();
		}),
});
