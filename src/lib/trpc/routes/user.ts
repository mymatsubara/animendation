import type { AuthUser } from '$lib/auth';
import { router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const user = router({
	me: authProcedure.query(({ ctx }) => {
		return ctx.user as AuthUser;
	}),
	myanimelist: authProcedure
		.input(
			z
				.object({
					sinceUtc: z.string().min(1)
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
			const client = ctx.malClient;

			if (input?.sinceUtc) {
				const sinceUtc = new Date(input.sinceUtc);
				if (isNaN(sinceUtc as any)) {
					throw new TRPCError({ code: 'BAD_REQUEST' });
				}

				return client.getUserAnimeListSince('@me', sinceUtc);
			} else {
				return client.getUserFullAnimeList('@me', {
					fields: 'list_status',
					sort: 'list_updated_at'
				});
			}
		})
});
