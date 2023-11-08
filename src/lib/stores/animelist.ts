import type { AnimeStatus, MangaStatus } from '$lib/clients/myanimelist';
import { indexedDb, type AnimeFromList, type IDB, type MangaFromList } from '$lib/idb';
import { toast } from '$lib/stores/toast';
import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';
import type { SerieType } from '$lib/types';
import { maxStr, toMap } from '$lib/utils/array';
import { writable } from 'svelte/store';

export type Myanimelist = ReturnType<typeof getMyanimelist>;
type UpsertOptions =
	| { status: AnimeStatus; type: 'Anime' }
	| { status: MangaStatus; type: 'Manga' };
let store = writable<Lists | undefined>();

user.subscribe(async (user) => {
	if (user) {
		await updateStore(user.username);
	} else {
		store.set(undefined);
	}
});

export type Lists = {
	animelist: Map<number, AnimeFromList>;
	mangalist: Map<number, MangaFromList>;
};

export function getMyanimelist() {
	return {
		subscribe: store.subscribe,
		upsert,
		remove,
	};
}

async function updateStore(username: string) {
	console.log(`Fetching ${username}'s animelist...`);
	const idb = await indexedDb();

	const [animes, mangas] = await Promise.all([
		getAnimelist(username, idb),
		getMangalist(username, idb),
	]);

	store.set({
		animelist: toMap(animes, (anime) => anime.id),
		mangalist: toMap(mangas, (manga) => manga.id),
	});
}

async function getAnimelist(username: string, idb: IDB) {
	const userAnimelist = await idb.getAllFromIndex(
		'animelist',
		'username',
		IDBKeyRange.only(username)
	);
	const mostRecentAnime = maxStr(userAnimelist, (anime) => anime.updatedAt);

	const animelist = await trpc.animelist.mine.query({
		sinceUtc: mostRecentAnime?.updatedAt,
		username,
	});

	const trx = idb.transaction('animelist', 'readwrite').store;
	await Promise.all(animelist.map((anime) => trx.put({ ...anime, username })));

	const animes = await idb.getAll('animelist');
	return animes;
}

async function getMangalist(username: string, idb: IDB) {
	const userAnimelist = await idb.getAllFromIndex(
		'mangalist',
		'username',
		IDBKeyRange.only(username)
	);
	const mostRecentAnime = maxStr(userAnimelist, (anime) => anime.updatedAt);

	const mangalist = await trpc.mangalist.mine.query({
		sinceUtc: mostRecentAnime?.updatedAt,
		username,
	});

	const trx = idb.transaction('mangalist', 'readwrite').store;
	await Promise.all(mangalist.map((anime) => trx.put({ ...anime, username })));

	const animes = await idb.getAll('mangalist');
	return animes;
}

async function upsert(serieId: number, { type, status }: UpsertOptions) {
	let previousState: Lists | undefined;
	try {
		const malUpdate =
			type === 'Anime'
				? trpc.animelist.upsert.mutate({ animeId: serieId, status })
				: trpc.mangalist.upsert.mutate({ mangaId: serieId, status });

		// Optmistic update
		store.update((list) => {
			if (!list) {
				return;
			}

			previousState = clone(list);

			const map = type === 'Anime' ? list.animelist : list.mangalist;
			const serie = map.get(serieId);

			const updatedAt = new Date().toISOString().replace('Z', '+00:00');
			if (serie) {
				serie.status = status as any;
				serie.updatedAt = updatedAt;
			} else {
				map.set(serieId, {
					id: serieId,
					updatedAt,
					status: status as any,
					title: 'Pending',
					finishDate: '',
					largePicture: '',
					mediumPicture: '',
					score: 0,
					startDate: '',
					username: '',
				});
			}

			return list;
		});

		await malUpdate;
	} catch (e) {
		console.error('Rolling back on error');
		store.set(previousState);
		toast.set({ message: 'Failed to update anime status', level: 'error' });
	}
}

async function remove(serieId: number, type: SerieType) {
	let previousState: Lists | undefined;
	try {
		const malUpdate =
			type === 'Anime'
				? trpc.animelist.remove.mutate({ animeId: serieId })
				: trpc.mangalist.remove.mutate({ mangaId: serieId });

		// Optmistic update
		store.update((list) => {
			if (!list) {
				return;
			}

			previousState = clone(list);
			type === 'Anime' ? list.animelist.delete(serieId) : list.mangalist.delete(serieId);

			return list;
		});

		await malUpdate;
	} catch (e) {
		console.error('Rolling back on error');
		store.set(previousState);
		toast.set({ message: 'Failed to remove anime from list', level: 'error' });
	}
}

function clone(list: Lists): Lists {
	return {
		animelist: new Map(list.animelist),
		mangalist: new Map(list.mangalist),
	};
}
