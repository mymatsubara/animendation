import { indexedDb, type AnimelistAnime } from '$lib/idb';
import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';
import { maxStr, toMap } from '$lib/utils/array';
import { writable } from 'svelte/store';

let store = writable<Animelist | undefined>();

user.subscribe(async (user) => {
	if (user) {
		await updateStore(user.username);
	} else {
		store.set(undefined);
	}
});

export type Animelist = Map<number, AnimelistAnime>;

export function getMyanimelist() {
	return {
		subscribe: store.subscribe
	};
}

async function updateStore(username: string) {
	console.log(`Fetching ${username}'s animelist...`);
	const idb = await indexedDb();

	// Get the most recent anime for the myanimelist
	const userAnimelist = await idb.getAllFromIndex(
		'animelist',
		'username',
		IDBKeyRange.only(username)
	);
	const mostRecentAnime = maxStr(userAnimelist, (anime) => anime.updatedAt);

	// Fetch animes since the most recent anime
	const animelist = await trpc.user.animelist.query({
		sinceUtc: mostRecentAnime?.updatedAt,
		username
	});

	// Update the idb with new animes
	const trx = idb.transaction('animelist', 'readwrite').store;
	await Promise.all(animelist.map((anime) => trx.put({ ...anime, username })));

	const animes = await idb.getAll('animelist');
	store.set(toMap(animes, (anime) => anime.id));
}
