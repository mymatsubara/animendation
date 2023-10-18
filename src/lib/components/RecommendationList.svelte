<script lang="ts">
	import { trpc } from '$lib/trpc/client';

	export let username: string;

	const recommendationsPromise = trpc.user.recommendations.query({ username });
</script>

<h2>My recommendations</h2>

{username}

{#await recommendationsPromise}
	Loadind...
{:then recommendations}
	Recommended animes: {recommendations}
{/await}
