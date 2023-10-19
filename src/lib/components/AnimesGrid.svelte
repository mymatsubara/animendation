<script lang="ts">
	import type { GetAnimesResult } from '$lib/client/animes';
	import Placeholder from '$lib/components/Placeholder.svelte';

	export let animes: GetAnimesResult | undefined;

	export let recommendations:
		| {
				mine: Set<number>;
				add: (animeId: number) => Promise<void>;
				remove: (animeId: number) => Promise<void>;
		  }
		| undefined = undefined;
</script>

<div
	class="grid gap-3 grid-cols-2 min-[470px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-4"
>
	{#if animes === undefined}
		{#each new Array(25).fill(0) as _}
			<div class="flex flex-col gap-2">
				<Placeholder class="rounded w-full aspect-[225/350]" />
				<Placeholder class="h-10 rounded" />
			</div>
		{/each}
	{:else}
		{#each Object.values(animes) as anime (anime.id)}
			{@const isRecommended = recommendations?.mine?.has(anime.id)}
			<div class="flex flex-col gap-1">
				{#if recommendations !== undefined}
					<button
						class="rounded w-full border"
						on:click={() =>
							isRecommended ? recommendations?.remove(anime.id) : recommendations?.add(anime.id)}
					>
						<div
							class="bg-center bg-cover w-full aspect-[225/350] rounded"
							style="background-image: url({anime.pictureMedium})"
						/>
					</button>
				{:else}
					<div
						class="bg-center bg-cover w-full aspect-[225/350] rounded"
						style="background-image: url({anime.pictureMedium})"
					/>
				{/if}

				<div class="h-11 overflow-ellipsis overflow-hidden text-sm font-medium text-gray-600">
					{anime.title}
				</div>
			</div>
		{/each}
	{/if}
</div>
