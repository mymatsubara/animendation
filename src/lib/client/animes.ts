import { browser } from '$app/environment';
import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { AnimeInfo } from '$lib/trpc/routes/anime';
import { toRecord } from '$lib/utils/array';

let memCache: MemCache = {};
type MemCache = { [id: number]: AnimeInfo };

export async function getAnimes(ids: number[]): Promise<AnimeInfo[]> {
	if (!browser) {
		return [];
	}

	const notMemCachedIds = ids.filter((id) => !memCache[id]);
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

		memCache = {
			...memCache,
			...(toRecord(idbCachedAnimes, (anime) => anime?.id ?? 0) as MemCache)
		};
		const notIdbCachedIds = ids.filter((id) => !memCache[id]);

		// Check backend for idb cache misses
		if (notIdbCachedIds.length > 0) {
			const animesToCache = await trpc.anime.info.mutate({
				ids: notIdbCachedIds
			});

			await Promise.all(animesToCache.map((anime) => idb.put('animes', anime)));

			for (const animeToCache of animesToCache) {
				memCache[animeToCache.id] = animeToCache;
			}
		}
	}

	return ids.map((id) => memCache[id]).filter((anime) => !!anime);
}
