<script lang="ts">
	import { getAnimes } from '$lib/client/animes';
	import { getRecommendations } from '$lib/client/recommendations';
	import AnimesGrid from '$lib/components/AnimesGrid.svelte';
	import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
	import { getMyanimelist } from '$lib/stores/animelist';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import { user } from '$lib/stores/user';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import { Button } from 'flowbite-svelte';

	export let username: string;
	export let onAddRecommendations: () => void;
	let animes: AnimeInfo[] | undefined = undefined;

	const animelist = getMyanimelist();
	const recommendations = getMyRecommendations();
	$: myRecommendations = username.toLowerCase() === $user?.username.toLocaleLowerCase();
	$: {
		if (myRecommendations) {
			if ($recommendations !== undefined) {
				getAnimes(Array.from($recommendations)).then((result) => (animes = result));
			}
		} else {
			getRecommendations(username).then((result) => (animes = result));
		}
	}
</script>

{#if animes === undefined || animes.length !== 0}
	<AnimesGrid {animes} animelist={$animelist} />
{:else}
	<div class="flex flex-col items-center justify-center gap-2 mt-24">
		<div class="font-bold text-3xl">(ಠ.ಠ)</div>
		<div class="text-gray-600">No recommendations</div>
		{#if myRecommendations}
			<Button class="mt-2 flex gap-1" on:click={onAddRecommendations}
				><PlusIcon class="h-5" /><span class="whitespace-nowrap">Add recommendations</span></Button
			>
		{/if}
	</div>
{/if}
