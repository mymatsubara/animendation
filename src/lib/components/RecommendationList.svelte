<script lang="ts">
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';

	export let username: string;

	onMount(async () => {
		const animes = await trpc.anime.info.query({
			ids: [1, 4, 5]
		});
		console.log({ animes });
	});
</script>

<h2>My recommendations</h2>

{username}
