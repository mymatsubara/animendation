<script lang="ts">
	import { getAnimelist } from '$lib/stores/animelist';
	import { user } from '$lib/stores/user';

	// Fetch user recomendations from trpc
	$: animelist = getAnimelist($user?.username);
</script>

recommendation
<a href="/recommendations/edit">Edit</a>
animelist

{#if !$animelist}
	<h1>Loading...</h1>
{:else}
	<ul>
		{#each Object.values($animelist) as anime}
			<li>{anime.title}</li>
		{/each}
	</ul>
{/if}
