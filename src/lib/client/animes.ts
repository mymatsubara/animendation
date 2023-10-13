import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { AnimeInfo } from '$lib/trpc/routes/anime';
import { toRecord } from '$lib/utils/array';

let memCache: GetAnimesResult = {};
type GetAnimesResult = { [id: number]: AnimeInfo };

export async function getAnimes(ids: number[]): Promise<GetAnimesResult> {
	console.time();

	const notMemCachedIds = ids.filter((id) => !memCache[id]);
	// Check idb for cache misses
	if (notMemCachedIds.length > 0) {
		const idb = await indexedDb();

		console.log({ notMemCachedIds });
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
			...(toRecord(idbCachedAnimes, (anime) => anime?.id ?? 0) as GetAnimesResult)
		};
		const notIdbCachedIds = ids.filter((id) => !memCache[id]);

		// Check backend for idb cache misses
		if (notIdbCachedIds.length > 0) {
			console.log({ notIdbCachedIds });

			const animesToCache = await trpc.anime.info.mutate({
				ids: notIdbCachedIds
			});

			console.log({ animesToCache });

			await Promise.all(animesToCache.map((anime) => idb.put('animes', anime)));

			for (const animeToCache of animesToCache) {
				memCache[animeToCache.id] = animeToCache;
			}
		}
	}

	console.timeEnd();
	return memCache;
}
