<script lang="ts">
	import { getAnimelist } from '$lib/stores/animelist';

	export let username: string;

	// Fetch user recomendations from trpc
	$: animelist = getAnimelist(username);
</script>

Animes
{#if !$animelist}
	<h1>Loading...</h1>
{:else}
	<ul>
		{#each Object.values($animelist) as anime}
			<li>{anime.title}</li>
		{/each}
	</ul>
{/if}
