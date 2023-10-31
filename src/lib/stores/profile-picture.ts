import { UsersService } from '$lib/clients/jikan/generated';
import { user } from '$lib/stores/user';
import { writable } from 'svelte/store';

const profilePicture = writable<string | undefined>();

async function fetchProfilePicture(username: string) {
	const profile = await UsersService.getUserProfile(username);

	return profile.data?.images?.webp?.image_url;
}

user.subscribe(async (user) => {
	if (user) {
		const pictureUrl = await fetchProfilePicture(user.username);
		if (pictureUrl) {
			profilePicture.set(pictureUrl);
			return;
		}
	}

	profilePicture.set(undefined);
});

export function getProfilePicture() {
	return {
		subscribe: profilePicture.subscribe
	};
}
