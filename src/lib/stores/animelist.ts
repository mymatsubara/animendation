import type { AnimeStatus } from '$lib/clients/myanimelist';
import { indexedDb, type AnimelistAnime } from '$lib/idb';
import { toast } from '$lib/stores/toast';
import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';
import { maxStr, toMap } from '$lib/utils/array';
import { writable } from 'svelte/store';

export type Myanimelist = ReturnType<typeof getMyanimelist>;
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
		subscribe: store.subscribe,
		upsert,
		remove
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
	const animelist = await trpc.animelist.mine.query({
		sinceUtc: mostRecentAnime?.updatedAt,
		username
	});

	// Update the idb with new animes
	const trx = idb.transaction('animelist', 'readwrite').store;
	await Promise.all(animelist.map((anime) => trx.put({ ...anime, username })));

	const animes = await idb.getAll('animelist');
	store.set(toMap(animes, (anime) => anime.id));
}

async function upsert(animeId: number, status: AnimeStatus) {
	let previousState: Animelist | undefined;
	try {
		const malUpdate = trpc.animelist.upsert.mutate({ animeId, status });

		// Optmistic update
		store.update((animelist) => {
			if (!animelist) {
				return;
			}

			previousState = new Map(animelist);

			const anime = animelist.get(animeId);
			const updatedAt = new Date().toISOString().replace('Z', '+00:00');
			if (anime) {
				anime.status = status;
				anime.updatedAt = updatedAt;
			} else {
				animelist.set(animeId, {
					id: animeId,
					updatedAt,
					status: status,
					title: 'Pending',
					finishDate: '',
					largePicture: '',
					mediumPicture: '',
					score: 0,
					startDate: '',
					username: ''
				});
			}

			return animelist;
		});

		await malUpdate;
	} catch (e) {
		console.error('Rolling back on error');
		store.set(previousState);
		toast.set({ message: 'Failed to update anime status', level: 'error' });
	}
}

async function remove(animeId: number) {
	let previousState: Animelist | undefined;
	try {
		const malUpdate = trpc.animelist.remove.mutate({ animeId });

		// Optmistic update
		store.update((animelist) => {
			if (!animelist) {
				return;
			}

			previousState = new Map(animelist);
			animelist.delete(animeId);

			return animelist;
		});

		await malUpdate;
	} catch (e) {
		console.error('Rolling back on error');
		store.set(previousState);
		toast.set({ message: 'Failed to remove anime from list', level: 'error' });
	}
}
