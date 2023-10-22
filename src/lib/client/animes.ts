import { browser } from '$app/environment';
import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { AnimeInfo } from '$lib/trpc/routes/anime';

let memCache: MemCache = new Map();
type MemCache = Map<number, AnimeInfo>;

export async function getAnimes(ids: number[]): Promise<AnimeInfo[]> {
	if (!browser) {
		return [];
	}

	const notMemCachedIds = ids.filter((id) => !memCache.has(id));
	// Check idb for cache misses
	if (notMemCachedIds.length > 0) {
		const idb = await indexedDb();

		// When a lot of animes are being fetched, it is faster to get all animes from idb instead
		const store = idb.transaction('animes', 'readonly').store;
		const idbCachedAnimes =
			notMemCachedIds.length > 2000
				? await idb.getAll('animes')
				: (await Promise.all(notMemCachedIds.map((id) => store.get(Number(id))))).filter(
						(anime) => anime
				  );

		idbCachedAnimes.forEach((anime) => {
			anime?.id && memCache.set(anime.id, anime);
		});

		const notIdbCachedIds = ids.filter((id) => !memCache.has(id));

		// Check backend for idb cache misses
		if (notIdbCachedIds.length > 0) {
			const animesToCache = await trpc.anime.info.mutate({
				ids: notIdbCachedIds
			});

			await Promise.all(animesToCache.map((anime) => idb.put('animes', anime)));

			animesToCache.forEach((anime) => {
				memCache.set(anime.id, anime);
			});
		}
	}

	return ids.map((id) => memCache.get(id)).filter((anime) => anime) as AnimeInfo[];
}
