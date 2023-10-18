<script lang="ts">
	import { getRecommendations } from '$lib/client/recommendations';

	export let username: string;

	$: recommendationsPromise = getRecommendations(username);
</script>

<h2>My recommendations</h2>

{username}

{#await recommendationsPromise}
	Loadind...
{:then recommendations}
	Recommended animes: {JSON.stringify(recommendations, null, 2)}
{/await}
