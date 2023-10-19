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
			getAnimes(Object.keys($animelist).map((id) => Number(id))).then(
				(result) => (animes = result)
			);
		}
	}

	const recommendations = getMyRecommendations();
</script>

<AnimesGrid
	{animes}
	recommendations={{
		mine: $recommendations,
		add: recommendations.add,
		remove: recommendations.remove
	}}
/>
