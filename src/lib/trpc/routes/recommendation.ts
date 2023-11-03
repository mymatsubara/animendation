import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { z } from 'zod';

export const recommendationRoute = router({
	list: publicProcedure
		.input(
			z.object({
				username: z.string()
			})
		)
		.query(async ({ input }) => {
			const recommendations = await db
				.selectFrom('Recommendation')
				.select(['animeId'])
				.where('userId', '=', (qb) =>
					qb.selectFrom('User').select(['id']).where('name', '=', input.username)
				)
				.orderBy('createdAt desc')
				.execute();

			return recommendations.map(({ animeId }) => animeId);
		}),
	mine: authProcedure.query(async ({ ctx }) => {
		const recommendations = await db
			.selectFrom('Recommendation')
			.select(['animeId'])
			.where('userId', '=', ctx.user.userId)
			.orderBy('createdAt desc')
			.execute();

		return recommendations.map(({ animeId }) => animeId);
	}),
	add: authProcedure
		.input(
			z.object({
				animeId: z.number().int().positive()
			})
		)
		.mutation(async ({ input, ctx }) => {
			await db
				.insertInto('Recommendation')
				.values({
					userId: ctx.user.userId,
					animeId: input.animeId
				})
				.execute();
		}),
	remove: authProcedure
		.input(
			z.object({
				animeId: z.number().int().positive()
			})
		)
		.mutation(async ({ input, ctx }) => {
			await db
				.deleteFrom('Recommendation')
				.where('animeId', '=', input.animeId)
				.where('userId', '=', ctx.user.userId)
				.execute();
		})
});
