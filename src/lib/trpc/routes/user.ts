import { Auth, AuthCookies, type AuthUser } from '$lib/auth';
import { UsersService } from '$lib/clients/jikan/generated';
import type { MALClient } from '$lib/clients/myanimelist';
import type { DB, User } from '$lib/server/schema';
import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';
import type { PaginatedData } from '$lib/trpc/types';
import { TRPCError } from '@trpc/server';
import { Kysely, sql, type Insertable } from 'kysely';
import { z } from 'zod';

type Follower = {
	id: number;
	name: string;
	picture: string | null;
};

export const userRoute = router({
	me: authProcedure.query(({ ctx }) => {
		return ctx.user as AuthUser;
	}),
	amIFollowing: authProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			return !!(await ctx.db
				.selectFrom('User')
				.select(['User.id'])
				.where('User.name', '=', input.username)
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
			let userToFollow = await ctx.db
				.selectFrom('User')
				.select(['id'])
				.where('name', '=', input.username)
				.executeTakeFirst();

			const userIdToFollow = userToFollow
				? userToFollow.id
				: (await upsertUser(ctx.db, ctx.malClient, input.username)).id;

			if (userIdToFollow === ctx.user.userId) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot follow yourself' });
			}

			const alreadyFollowing = !!(await ctx.db
				.selectFrom('Follower')
				.select('createdAt')
				.where('userId', '=', ctx.user.userId)
				.where('followedUserId', '=', userIdToFollow)
				.executeTakeFirst());

			await ctx.db.transaction().execute(async (trx) => {
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
					.where('id', '=', userIdToFollow)
					.execute();

				const modifyFollowerTable = alreadyFollowing
					? trx
							.deleteFrom('Follower')
							.where('userId', '=', ctx.user.userId)
							.where('followedUserId', '=', userIdToFollow)
							.execute()
					: trx
							.insertInto('Follower')
							.values({
								userId: ctx.user.userId,
								followedUserId: userIdToFollow,
							})
							.execute();

				await Promise.all([incrementFollowing, incrementFollowers, modifyFollowerTable]);
			});
		}),
	followers: publicProcedure
		.input(
			z.object({
				username: z.string(),
				limit: z.number().int().positive().default(20),
				nextPageToken: z.number().optional(),
			})
		)
		.query(async ({ input, ctx }) => {
			const followers = await ctx.db
				.selectFrom('Follower')
				.innerJoin('User as FollowerUser', 'FollowerUser.id', 'Follower.userId')
				.where('Follower.followedUserId', '=', (qb) =>
					qb.selectFrom('User').select('User.id').where('User.name', '=', input.username)
				)
				.select([
					'Follower.id as followerId',
					'FollowerUser.id',
					'FollowerUser.name',
					'FollowerUser.picture',
				])
				.orderBy('Follower.id desc')
				.$if(input.nextPageToken !== undefined, (qb) =>
					qb.where('Follower.id', '<', input.nextPageToken as number)
				)
				.limit(input.limit)
				.execute();

			const result: PaginatedData<Follower> = {
				data: followers.map(({ followerId, ...data }) => data),
				hasNextPage: followers.length >= input.limit,
				nextPageToken: followers.at(-1)?.followerId ?? 0,
			};

			return result;
		}),
	following: publicProcedure
		.input(
			z.object({
				username: z.string(),
				limit: z.number().int().positive().default(20),
				nextPageToken: z.number().optional(),
			})
		)
		.query(async ({ input, ctx }) => {
			const followings = await ctx.db
				.selectFrom('Follower')
				.innerJoin('User as FollowingUser', 'FollowingUser.id', 'Follower.followedUserId')
				.where('Follower.userId', '=', (qb) =>
					qb.selectFrom('User').select('User.id').where('User.name', '=', input.username)
				)
				.select([
					'Follower.id as followerId',
					'FollowingUser.id',
					'FollowingUser.name',
					'FollowingUser.picture',
				])
				.orderBy('Follower.id desc')
				.$if(input.nextPageToken !== undefined, (qb) =>
					qb.where('Follower.id', '<', input.nextPageToken as number)
				)
				.limit(input.limit)
				.execute();

			const result: PaginatedData<Follower> = {
				data: followings.map(({ followerId, ...data }) => data),
				hasNextPage: followings.length >= input.limit,
				nextPageToken: followings.at(-1)?.followerId ?? 0,
			};

			return result;
		}),
	refreshMyProfile: authProcedure.mutation(async ({ ctx }) => {
		const user = await upsertUser(ctx.db, ctx.malClient);

		// Issue a new backend access token
		const accessToken = await Auth.signBackendAccessToken({
			userId: user.id ?? ctx.user.userId,
			picture: user.picture ?? ctx.user.picture,
			username: user.name ?? ctx.user.username,
		});
		AuthCookies.setBackendAccessTokenCookie(ctx.event.cookies, accessToken);

		return user;
	}),
	randomWithRecommendation: authProcedure
		.input(
			z.object({
				limit: z.number().finite().positive(),
			})
		)
		.query(async ({ ctx, input }) => {
			const random = await ctx.db
				.selectNoFrom(sql<number>`CEIL(RAND() * (select MAX(id) from User))`.as('id'))
				.executeTakeFirst();

			if (!random) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Could not generate random id',
				});
			}

			let limit = input.limit;
			const createQuery = (cmp: '>=' | '<') =>
				ctx.db
					.selectFrom('User')
					.select(['User.name', 'User.id'])
					.innerJoin('AnimeRecommendation', 'AnimeRecommendation.userId', 'User.id')
					.leftJoin('Follower', (join) =>
						join
							.onRef('Follower.followedUserId', '=', 'User.id')
							.on('Follower.userId', '=', ctx.user.userId)
					)
					.where('Follower.id', 'is', null) // Fetch only user that I'm not following
					.where('User.id', cmp, random.id)
					.where('User.id', '<>', ctx.user.userId)
					.having(sql`COUNT(*)`, '>', 0)
					.groupBy('User.id')
					.orderBy('User.id')
					.limit(limit);

			let users = await createQuery('>=').execute();
			limit -= users.length;

			if (limit > 0) {
				const moreUsers = await createQuery('<').execute();
				users = [...users, ...moreUsers];
			}

			return users;
		}),
	followersCount: publicProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.query(async ({ input, ctx }) => {
			const user = await ctx.db
				.selectFrom('User')
				.select(['followersCount', 'followingCount'])
				.where('name', '=', input.username)
				.executeTakeFirst();

			return {
				followersCount: user?.followersCount ?? 0,
				followingCount: user?.followingCount ?? 0,
			};
		}),
});

export async function upsertUser(db: Kysely<DB>, client: MALClient, username?: string) {
	let user: Insertable<User>;

	if (username) {
		const { data } = await UsersService.getUserProfile(username);

		if (!data?.mal_id || !data?.username) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: `User not found`,
			});
		}

		user = {
			id: data.mal_id,
			name: data.username,
			picture: data.images?.webp?.image_url,
		};
	} else {
		const { id, name, picture } = await client.getMe();

		if (!id || !name) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: `User not found`,
			});
		}

		user = {
			id,
			name,
			picture,
		};
	}

	await db
		.insertInto('User')
		.values(user)
		.onConflict((oc) =>
			oc.column('id').doUpdateSet(({ ref }) => ({ name: ref('name'), picture: ref('picture') }))
		)
		.execute();

	return user;
}
