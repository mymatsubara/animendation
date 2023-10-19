<script lang="ts">
	import type { GetAnimesResult } from '$lib/client/animes';
	import { getRecommendations } from '$lib/client/recommendations';
	import AnimesGrid from '$lib/components/AnimesGrid.svelte';

	export let username: string;
	let animes: GetAnimesResult | undefined = undefined;

	$: {
		getRecommendations(username).then((result) => (animes = result));
	}
</script>

<AnimesGrid {animes} />
