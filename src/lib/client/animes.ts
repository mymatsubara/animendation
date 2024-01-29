import { browser } from '$app/environment';
import { setLastIdbUpdateTime, updateIdbCache } from '$lib/client/idb';
import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { AnimeInfo } from '$lib/trpc/routes/anime';

let memCache: AnimeMemCache = new Map();
type AnimeMemCache = Map<number, AnimeInfo>;

export async function getAnimes(ids: number[]): Promise<AnimeInfo[]> {
	if (!browser) {
		return [];
	}

	await updateIdbCache('Anime');
	const notMemCachedIds = ids.filter((id) => !memCache.has(id));

	// Check idb for cache misses
	if (notMemCachedIds.length > 0) {
		const idb = await indexedDb();

		// When a lot of series are being fetched, it is faster to getAll series from idb instead
		const store = idb.transaction('animes', 'readonly').store;
		const idbCachedSeries =
			notMemCachedIds.length > 2000
				? await idb.getAll('animes')
				: (await Promise.all(notMemCachedIds.map((id) => store.get(Number(id))))).filter(
						(anime) => anime
				  );

		idbCachedSeries.forEach((serie) => {
			serie?.id && memCache.set(serie.id, serie as any);
		});

		const notIdbCachedIds = ids.filter((id) => !memCache.has(id));

		// Check backend for idb cache misses
		if (notIdbCachedIds.length > 0) {
			const animesToCache = await trpc.anime.info.mutate({
				ids: notIdbCachedIds,
			});

			await Promise.all(animesToCache.map((anime) => idb.put('animes', anime)));

			animesToCache.forEach((anime) => {
				memCache.set(anime.id, anime);
			});

			setLastIdbUpdateTime('Anime', new Date());
		}
	}

	return ids.map((id) => memCache.get(id)).filter((anime) => anime) as AnimeInfo[];
}
