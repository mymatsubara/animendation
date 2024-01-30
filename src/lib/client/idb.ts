import { indexedDb } from '$lib/idb';
import { trpc } from '$lib/trpc/client';
import type { SerieType } from '$lib/types';
import { isDateValid } from '$lib/utils/date';
import { convertTime } from '$lib/utils/time';

const staleTimeMs = convertTime(1, 'weeks', 'milliseconds');
const sinceOffset = convertTime(1, 'hours', 'milliseconds');

/// Use this function to refetch series with stale picture
export async function updateIdbCache(type: SerieType) {
	try {
		const lastUpdate = getLastIdbUpdateTime(type);

		if (!lastUpdate || Date.now() - lastUpdate.getTime() < staleTimeMs) {
			return;
		}

		const idb = await indexedDb();
		const since = new Date(lastUpdate.getTime() - sinceOffset).toUTCString();

		if (type === 'Anime') {
			const animes = await trpc.anime.withPictureUpdated.query({ since });
			await Promise.all(animes.map((anime) => idb.put('animes', anime)));
			console.log('updating...', animes);
		} else if (type === 'Manga') {
			const mangas = await trpc.manga.withPictureUpdated.query({ since });
			await Promise.all(mangas.map((manga) => idb.put('mangas', manga)));
		}

		setLastIdbUpdateTime(type, new Date());
	} catch (e) {
		console.error('Error while updating idb cache', e);
	}
}

function getLastIdbUpdateTime(type: SerieType) {
	const key = getLastUpdateKey(type);
	const date = new Date(window.localStorage.getItem(key) ?? 'invalid');

	return isDateValid(date) ? date : undefined;
}

export function setLastIdbUpdateTime(type: SerieType, time: Date) {
	const key = getLastUpdateKey(type);

	window.localStorage.setItem(key, time.toUTCString());
}

function getLastUpdateKey(type: SerieType) {
	return `${type}-last-refresh`;
}
