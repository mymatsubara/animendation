<script lang="ts">
	import AnimeStatusSelect from '$lib/components/selects/SerieStatusSelect.svelte';
	import type { Myanimelist } from '$lib/stores/animelist';
	import type { SerieType } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

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
			on:error={() => {
				pictureUrl = null;
			}}
			class={twMerge(
				'object-cover w-full aspect-[225/318] rounded border border-gray-300 image-pulse',
				$$restProps.class
			)}
			alt="{title} picture"
			loading="lazy"
		/>
	{:else}
		<div
			class={twMerge(
				'gap-2 flex flex-col items-center justify-center bg-gray-300 w-full aspect-[225/318] rounded border border-gray-300',
				$$restProps.class
			)}
		>
			<div class="text-xl font-semibold">(⊙_⊙)</div>
			<div class="text-gray-600">No picture</div>
		</div>
	{/if}

	{#if statusHandler}
		<div transition:fade={{ duration: 150 }} class="absolute right-0 bottom-0">
			<AnimeStatusSelect {...statusHandler} serieTitle={title} />
		</div>
	{/if}
</div>

<style>
	.image-pulse {
		background-color: #d1d5db44;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		50% {
			background-color: #d1d5dbcc;
		}
	}
</style>
