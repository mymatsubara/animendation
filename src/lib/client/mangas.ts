import { browser } from '$app/environment';
import { setLastIdbUpdateTime, updateIdbCache } from '$lib/client/idb';
import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { MangaInfo } from '$lib/trpc/routes/manga';

let memCache: MangaMemCache = new Map();
type MangaMemCache = Map<number, MangaInfo>;

export async function getMangas(ids: number[]): Promise<MangaInfo[]> {
	if (!browser) {
		return [];
	}

	await updateIdbCache('Manga');
	const notMemCachedIds = ids.filter((id) => !memCache.has(id));

	// Check idb for cache misses
	if (notMemCachedIds.length > 0) {
		const idb = await indexedDb();

		// When a lot of series are being fetched, it is faster to getAll series from idb instead
		const store = idb.transaction('mangas', 'readonly').store;
		const idbCachedSeries =
			notMemCachedIds.length > 2000
				? await idb.getAll('mangas')
				: (await Promise.all(notMemCachedIds.map((id) => store.get(Number(id))))).filter(
						(manga) => manga
				  );

		idbCachedSeries.forEach((serie) => {
			serie?.id && memCache.set(serie.id, serie as any);
		});

		const notIdbCachedIds = ids.filter((id) => !memCache.has(id));

		// Check backend for idb cache misses
		if (notIdbCachedIds.length > 0) {
			const mangasToCache = await trpc.manga.info.mutate({
				ids: notIdbCachedIds,
			});

			await Promise.all(mangasToCache.map((manga) => idb.put('mangas', manga)));

			mangasToCache.forEach((manga) => {
				memCache.set(manga.id, manga);
			});

			setLastIdbUpdateTime('Manga', new Date());
		}
	}

	return ids.map((id) => memCache.get(id)).filter((manga) => manga) as MangaInfo[];
}
