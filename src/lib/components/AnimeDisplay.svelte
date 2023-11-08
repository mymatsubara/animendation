<script lang="ts">
	import AnimeStatusSelect from '$lib/components/selects/AnimeStatusSelect.svelte';
	import type { Myanimelist } from '$lib/stores/animelist';
	import type { SerieType } from '$lib/types';
	import { fade } from 'svelte/transition';

	export let title: string;
	export let pictureUrl: string | null;
	export let statusHandler:
		| {
				animelist: Myanimelist;
				serieId: number;
				type: SerieType;
		  }
		| undefined;
</script>

<div class="relative">
	{#if pictureUrl}
		<img
			src={pictureUrl}
			class="object-cover w-full aspect-[225/318] rounded"
			alt="{title} picture"
			loading="lazy"
		/>
	{:else}
		<div
			class="gap-2 flex flex-col items-center justify-center bg-gray-300 w-full aspect-[225/318] rounded"
		>
			<div class="text-xl font-semibold">(⊙_⊙)</div>
			<div class="text-gray-600">No picture</div>
		</div>
	{/if}

	{#if statusHandler}
		<div transition:fade={{ duration: 150 }} class="absolute right-0 bottom-0">
			<AnimeStatusSelect {...statusHandler} />
		</div>
	{/if}
</div>
