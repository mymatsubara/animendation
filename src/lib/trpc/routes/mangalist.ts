import { mangaStatus, type MangaStatus } from '$lib/clients/myanimelist';
import type { UserMangaListEdge } from '$lib/clients/myanimelist/generated/models/UserMangaListEdge';
import { db } from '$lib/server/db';
import { router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export type ListManga = ReturnType<typeof mapListManga>;

export const mangaListRouter = router({
	mine: authProcedure
		.input(
			z
				.object({
					sinceUtc: z.string().min(1).optional(),
					username: z.string().min(1).optional(),
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
			const client = ctx.malClient;
			const username = input?.username ?? '@me';

			let mangas: UserMangaListEdge[];
			if (input?.sinceUtc) {
				const sinceUtc = new Date(input.sinceUtc);
				if (isNaN(sinceUtc as any)) {
					throw new TRPCError({ code: 'BAD_REQUEST' });
				}

				mangas = await client.getUserMangalistSince(username, sinceUtc);
			} else {
				mangas = await client.getUserFullMangalist(username, {
					fields: 'list_status',
					sort: 'list_updated_at',
				});
			}

			return mangas.map(mapListManga);
		}),
	upsert: authProcedure
		.input(
			z.object({
				mangaId: z.number().int().positive(),
				status: z.enum(mangaStatus),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const read =
				input.status !== 'completed'
					? undefined
					: await db
							.selectFrom('Manga')
							.select(['volumes', 'chapters'])
							.where('id', '=', input.mangaId)
							.executeTakeFirst();

			return ctx.malClient.updateMangaStatusOnList({
				mangaId: input.mangaId,
				status: input.status,
				...(typeof read?.chapters === 'number' && typeof read?.volumes === 'number'
					? { num_volumes_read: read.volumes, num_chapters_read: read.chapters }
					: {}),
			});
		}),
	remove: authProcedure
		.input(
			z.object({
				mangaId: z.number().int().positive(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.malClient.removeMangaFromList(input.mangaId);
		}),
});

function mapListManga(anime: UserMangaListEdge) {
	return {
		id: anime?.node?.id as number,
		largePicture: anime.node?.main_picture?.large as string,
		mediumPicture: anime.node?.main_picture?.medium as string,
		title: anime.node?.title as string,
		status: anime?.list_status?.status as MangaStatus,
		score: anime?.list_status?.score as number,
		updatedAt: anime?.list_status?.updated_at as string,
		startDate: anime?.list_status?.start_date as string,
		finishDate: anime?.list_status?.finish_date as string,
	};
}
