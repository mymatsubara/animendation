<script lang="ts">
	import ThumbsUpIcon from '$lib/components/icons/ThumbsUpIcon.svelte';
	import AnimeStatusSelect from '$lib/components/select/AnimeStatusSelect.svelte';
	import type { Myanimelist } from '$lib/stores/animelist';
	import { Badge } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	export let title: string;
	export let pictureUrl: string | null;
	export let isRecommended = false;
	export let statusHandler:
		| {
				animelist: Myanimelist;
				animeId: number;
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

	{#if isRecommended}
		<div class="absolute top-2 right-2" transition:fade={{ duration: 150 }}>
			<Badge class="p-2" color="green" rounded>
				<ThumbsUpIcon class="h-5 mr-1" />
				Recommended
			</Badge>
		</div>
	{/if}
	{#if statusHandler}
		<div transition:fade={{ duration: 150 }} class="absolute right-0 bottom-0">
			<AnimeStatusSelect {...statusHandler} />
		</div>
	{/if}
</div>
