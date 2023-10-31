<script lang="ts">
	import { getAnimes } from '$lib/client/animes';
	import AnimesGrid from '$lib/components/AnimesGrid.svelte';
	import { getMyanimelist } from '$lib/stores/animelist';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';

	let animes: AnimeInfo[] | undefined = undefined;

	// Fetch user recomendations from trpc
	const animelist = getMyanimelist();
	$: {
		if ($animelist) {
			const anilist = $animelist;
			getAnimes([...anilist.keys()]).then((result) => {
				const animeInfos = result.map((anime) => ({ ...anime, ...anilist.get(anime.id) }));
				animeInfos.sort((a1, a2) =>
					a2.updatedAt && a1.updatedAt ? a2.updatedAt.localeCompare(a1.updatedAt) : 1
				);
				animes = animeInfos;
			});
		}
	}
</script>

<AnimesGrid {animes} animelist={$animelist} recommend />
