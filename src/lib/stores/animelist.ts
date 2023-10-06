import { browser } from '$app/environment';
import { indexedDb, type AnimelistAnime } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import { maxStr, toRecord } from '$lib/utils/array';
import { writable } from 'svelte/store';

let curUserName: string | undefined = undefined;
let store = writable<{ [id: number]: AnimelistAnime } | undefined>();

export function getAnimelist(username?: string) {
	if (browser && username !== curUserName) {
		if (username === undefined) {
			store.set(undefined);
		} else {
			updateStore(username);
		}

		curUserName = username;
	}

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
	console.log({ userAnimelist });
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
	store.set(toRecord(animes, (anime) => anime.id));
}
