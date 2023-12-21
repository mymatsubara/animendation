import { UsersService, type user_profile } from '$lib/clients/jikan/generated';

const cache: Map<string, Promise<user_profile | undefined>> = new Map();

async function fetchProfile(username: string) {
	const profile = await UsersService.getUserProfile(username);

	return profile?.data;
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
