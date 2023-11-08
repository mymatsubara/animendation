<script lang="ts">
	import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
	import SeriesGrid from '$lib/components/recommendations/SeriesGrid.svelte';
	import type { Serie } from '$lib/components/recommendations/types';
	import type { SerieType } from '$lib/types';
	import { Button } from 'flowbite-svelte';

	export let onAddRecommendations: () => void;
	export let series: Serie[] | undefined;
	export let type: SerieType;
	export let myRecommendations: boolean;
</script>

{#if series === undefined || series.length !== 0}
	<SeriesGrid {series} {type} />
{:else}
	<div class="flex flex-col items-center justify-center gap-2 mt-10">
		<div class="font-bold text-3xl">(ಠ.ಠ)</div>
		<div class="text-gray-600">No {type.toLocaleLowerCase()} recommendations</div>
		{#if myRecommendations}
			<Button class="mt-2 flex gap-1" on:click={onAddRecommendations}
				><PlusIcon class="h-5" /><span class="whitespace-nowrap">Add recommendations</span></Button
			>
		{/if}
	</div>
{/if}
