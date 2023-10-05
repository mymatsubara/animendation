<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';

	if (!$user && browser) {
		goto('/');
	}

	const u = $user;

	onMount(async () => {
		// const animes = await trpc.user.myanimelist.query();
		// console.log({ animes });
	});
</script>

<!-- {#await animesPromise}
	Loading my anime list...
{:then animes}
	{console.log({ animes })}
	{#each animes as anime (anime?.node?.id)}
		<img src={anime.node?.main_picture?.['0'] ?? ''} />
		{anime.node?.title}
	{/each}
{:catch e}
	<div class="text-red-500">Unexpected error. Try refreshing the page. (Error: {e})</div>
{/await} -->
