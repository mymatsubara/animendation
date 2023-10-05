import { browser } from '$app/environment';
import type { AuthUser } from '$lib/auth/types';
import { JwtUtils } from '$lib/utils/jwt';
import { writable } from 'svelte/store';

type User = {
	accessToken: string;
	data: AuthUser;
};

function loadUser() {
	const userKey = 'user';
	const stored = browser ? localStorage.getItem(userKey) : null;
	let storedUser = stored ? (JSON.parse(stored) as User) : null;

	if (storedUser && JwtUtils.isExpired(storedUser.accessToken)) {
		// TODO: refresh the token
		// storeUser = return_from_refresh_endpoint
	}

	const store = writable<User | null>(storedUser);

	function set(user: User | null) {
		store.set(user);

		if (user) {
			localStorage.setItem(userKey, JSON.stringify(user));
		} else {
			localStorage.removeItem(userKey);
		}
	}

	return {
		subscribe: store.subscribe,
		set: set
	};
}

export const user = loadUser();
