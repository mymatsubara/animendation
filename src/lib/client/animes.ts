import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { AnimeInfo } from '$lib/trpc/routes/anime';
import { toRecord } from '$lib/utils/array';

let memCache: GetAnimesResult = {};
type GetAnimesResult = { [id: number]: AnimeInfo };

export async function getAnimes(ids: number[]): Promise<GetAnimesResult> {
	console.time();
	console.log({ ids });

	const notMemCachedIds = ids.filter((id) => !memCache[id]);
	// Check idb for cache misses
	if (notMemCachedIds.length > 0) {
		const idb = await indexedDb();

		console.log({ notMemCachedIds });
		const idbCachedAnimes = (
			await Promise.all(notMemCachedIds.map((id) => idb.get('animes', id)))
		).filter((anime) => anime);

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
