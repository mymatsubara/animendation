import type { AuthUser } from '$lib/auth';
import type { UserAnimeListEdge } from '$lib/clients/myanimelist/generated/models/UserAnimeListEdge';
import { db } from '$lib/server/db';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { TRPCError } from '@trpc/server';
import { sql } from 'kysely';
import { z } from 'zod';

export const userRoute = router({
	me: authProcedure.query(({ ctx }) => {
		return ctx.user as AuthUser;
	}),
	animelist: authProcedure
		.input(
			z
				.object({
					sinceUtc: z.string().min(1).optional(),
					username: z.string().min(1).optional()
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
			const client = ctx.malClient;
			const username = input?.username ?? '@me';

			let animes: UserAnimeListEdge[];
			if (input?.sinceUtc) {
				const sinceUtc = new Date(input.sinceUtc);
				if (isNaN(sinceUtc as any)) {
					throw new TRPCError({ code: 'BAD_REQUEST' });
				}

				animes = await client.getUserAnimeListSince(username, sinceUtc);
			} else {
				animes = await client.getUserFullAnimeList(username, {
					fields: 'list_status',
					sort: 'list_updated_at'
				});
			}

			return animes.map(mapListAnime);
		}),
	recommendations: publicProcedure
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
					qb
						.selectFrom('User')
						.select(['id'])
						.where(({ ref }) => sql`${ref('name')} = ${input.username} collate nocase`)
				)
				.execute();

			return recommendations.map(({ animeId }) => animeId);
		})
});

export type AnimeStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
export type ListAnime = ReturnType<typeof mapListAnime>;

function mapListAnime(anime: UserAnimeListEdge) {
	return {
		id: anime?.node?.id as number,
		largePicture: anime.node?.main_picture?.large as string,
		mediumPicture: anime.node?.main_picture?.medium as string,
		title: anime.node?.title as string,
		status: anime?.list_status?.status as AnimeStatus,
		score: anime?.list_status?.score as number,
		updatedAt: anime?.list_status?.updated_at as string,
		startDate: anime?.list_status?.start_date as string,
		finishDate: anime?.list_status?.finish_date as string
	};
}
