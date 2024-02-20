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
		.query(async ({ input, ctx }) => {
			const animeRecommendations = ctx.db
				.selectFrom('AnimeRecommendation')
				.select(['animeId'])
				.where('userId', '=', (qb) =>
					qb.selectFrom('User').select(['id']).where('name', '=', input.username)
				)
				.orderBy('createdAt desc')
				.execute();

			const mangaRecommendations = ctx.db
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
		const animeRecommendations = ctx.db
			.selectFrom('AnimeRecommendation')
			.select(['animeId'])
			.where('userId', '=', ctx.user.userId)
			.orderBy('createdAt desc')
			.execute();

		const mangaRecommendations = ctx.db
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
				await ctx.db
					.insertInto(`AnimeRecommendation`)
					.values({
						userId: ctx.user.userId,
						animeId: input.serieId,
					})
					.execute();
			} else {
				await ctx.db
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
			await ctx.db
				.deleteFrom(`${input.type}Recommendation`)
				.where(input.type === 'Anime' ? 'animeId' : 'mangaId', '=', input.serieId)
				.where('userId', '=', ctx.user.userId)
				.execute();
		}),
});
