<script lang="ts">
	import { getAnimes, type GetAnimesResult } from '$lib/client/animes';
	import AnimesGrid from '$lib/components/AnimesGrid.svelte';
	import { getAnimelist } from '$lib/stores/animelist';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';

	export let username: string;
	let animes: GetAnimesResult | undefined = undefined;

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

<div class="text-gray-500 text-sm">Click to recommend/unrecommend an anime</div>

<AnimesGrid
	{animes}
	recommendations={{
		mine: $recommendations,
		add: recommendations.add,
		remove: recommendations.remove
	}}
/>
