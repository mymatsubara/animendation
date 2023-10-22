<script lang="ts">
	import { getAnimes } from '$lib/client/animes';
	import AnimesGrid from '$lib/components/AnimesGrid.svelte';
	import { getAnimelist } from '$lib/stores/animelist';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';

	export let username: string;
	let animes: AnimeInfo[] | undefined = undefined;

	// Fetch user recomendations from trpc
	const animelist = getAnimelist(username);
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

	const recommendations = getMyRecommendations();
</script>

<AnimesGrid
	{animes}
	animelist={$animelist}
	recommendations={{
		mine: $recommendations,
		add: recommendations.add,
		remove: recommendations.remove
	}}
/>
