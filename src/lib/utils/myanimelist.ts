import type { SerieType } from '$lib/types';

export function getMyanimelistSeriesUrl(serieId: number, type: SerieType) {
	return `https://myanimelist.net/${type.toLowerCase()}/${serieId}`;
}
