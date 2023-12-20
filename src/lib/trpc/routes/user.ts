import type { AuthUser } from '$lib/auth';
import { db } from '$lib/server/db';
import { router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import { TRPCError } from '@trpc/server';
import { sql } from 'kysely';
import { z } from 'zod';

export const userRoute = router({
	me: authProcedure.query(({ ctx }) => {
		return ctx.user as AuthUser;
	}),
	imFollowing: authProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			return !!(await db
				.selectFrom('User')
				.select(['id'])
				.where('name', '=', input.username)
				.innerJoin('Follower', (join) =>
					join
						.onRef('Follower.followedUserId', '=', 'User.id')
						.on('Follower.userId', '=', ctx.user.userId)
				)
				.executeTakeFirst());
		}),
	toggleFollow: authProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userToFollow = await db
				.selectFrom('User')
				.select(['id'])
				.where('name', '=', input.username)
				.executeTakeFirst();

			if (!userToFollow) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'User does not have account' });
			}

			if (userToFollow.id === ctx.user.userId) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot follow yourself' });
			}

			const alreadyFollowing = !!(await db
				.selectFrom('Follower')
				.select('createdAt')
				.where('userId', '=', ctx.user.userId)
				.where('followedUserId', '=', userToFollow.id)
				.executeTakeFirst());

			await db.transaction().execute(async (trx) => {
				const increment = alreadyFollowing ? -1 : 1;
				const incrementFollowing = trx
					.updateTable('User')
					.set({
						followingCount: ({ ref }) => sql`${ref('followingCount')} + ${increment}`,
					})
					.where('id', '=', ctx.user.userId)
					.execute();

				const incrementFollowers = trx
					.updateTable('User')
					.set({
						followersCount: ({ ref }) => sql`${ref('followersCount')} + ${increment}`,
					})
					.where('id', '=', userToFollow.id)
					.execute();

				const modifyFollowerTable = alreadyFollowing
					? trx
							.deleteFrom('Follower')
							.where('userId', '=', ctx.user.userId)
							.where('followedUserId', '=', userToFollow.id)
							.execute()
					: trx
							.insertInto('Follower')
							.values({
								userId: ctx.user.userId,
								followedUserId: userToFollow.id,
							})
							.execute();

				await Promise.all([incrementFollowing, incrementFollowers, modifyFollowerTable]);
			});
		}),
	randomWithRecommendation: authProcedure
		.input(
			z.object({
				limit: z.number().finite().positive(),
			})
		)
		.query(async ({ ctx, input }) => {
			const random = await db
				.selectNoFrom(sql<number>`CEIL(RAND() * (select MAX(id) from User))`.as('id'))
				.executeTakeFirst();

			if (!random) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Could not generate random id',
				});
			}

			let limit = input.limit;
			const createQuery = (limit: number, cmp: '>=' | '<') =>
				db
					.selectFrom('User')
					.select(['User.name'])
					.innerJoin('AnimeRecommendation', 'AnimeRecommendation.userId', 'User.id')
					.where('User.id', cmp, random.id)
					.where('User.id', '<>', ctx.user.userId)
					.having(sql`COUNT(*)`, '>', 0)
					.groupBy('User.id')
					.orderBy('User.id')
					.limit(input.limit);

			let users = await createQuery(limit, '>=').execute();
			limit -= users.length;

			if (limit > 0) {
				const moreUsers = await createQuery(limit, '<').execute();
				users = [...users, ...moreUsers];
			}

			return users;
		}),
});
