<script lang="ts">
	import { getAnimes } from '$lib/client/animes';
	import { getMangas } from '$lib/client/mangas';
	import SeriesGrid from '$lib/components/recommendations/SeriesGrid.svelte';
	import type { Serie } from '$lib/components/recommendations/types';
	import { getMyanimelist } from '$lib/stores/animelist';
	import type { SerieType } from '$lib/types';

	export let type: SerieType;
	let series: Serie[] | undefined = undefined;

	// Fetch user recomendations from trpc
	const myanimelist = getMyanimelist();
	$: {
		if ($myanimelist) {
			const lists = $myanimelist;
			const list = type === 'Anime' ? lists.animelist : lists.mangalist;

			(type === 'Anime' ? getAnimes([...list.keys()]) : getMangas([...list.keys()])).then(
				(result) => {
					const serieInfo = result.map((anime) => ({ ...anime, ...list.get(anime.id) }));
					serieInfo.sort((a1: any, a2: any) =>
						a2.updatedAt && a1.updatedAt ? a2.updatedAt.localeCompare(a1.updatedAt) : 1
					);
					series = serieInfo;
				}
			);
		}
	}
</script>

<SeriesGrid {series} {type} recommend />
