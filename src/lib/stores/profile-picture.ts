import { UsersService, type user_profile } from '$lib/clients/jikan/generated';
import { trpc } from '$lib/trpc/client';
import type { inferAsyncReturnType } from '@trpc/server';

type FollowersCount = inferAsyncReturnType<typeof trpc.user.followersCount.query>;
export type UserProfile = user_profile & FollowersCount;
const cache: Map<string, Promise<UserProfile | undefined>> = new Map();

async function fetchProfile(username: string) {
	const [profile, followersCount] = await Promise.all([
		UsersService.getUserProfile(username),
		trpc.user.followersCount.query({ username }),
	]);

	if (!profile?.data) {
		return undefined;
	}

	return { ...profile.data, ...followersCount };
}

export async function getUserProfile(username: string) {
	if (!username) {
		return undefined;
	}

	const key = username.toLowerCase();
	const cacheHit = cache.get(key);

	if (cacheHit) {
		return cacheHit;
	}

	const userProfile = fetchProfile(username);
	if (userProfile) {
		cache.set(key, userProfile);
	}

	return userProfile;
}
