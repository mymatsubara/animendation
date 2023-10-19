<script lang="ts">
	import Placeholder from '$lib/components/Placeholder.svelte';
	import ThumbsUpIcon from '$lib/components/icons/ThumbsUpIcon.svelte';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import { fade } from 'svelte/transition';

	export let animes: AnimeInfo[] | undefined;

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
		{#each animes as anime (anime.id)}
			{@const isRecommended = recommendations?.mine?.has(anime.id)}
			{@const href = `https://myanimelist.net/anime/${anime.id}`}
			<div class="flex flex-col gap-1">
				{#if recommendations !== undefined}
					<button
						class="rounded w-full border hover:shadow-lg hover:border-2"
						on:click={() =>
							isRecommended ? recommendations?.remove(anime.id) : recommendations?.add(anime.id)}
					>
						<div class="relative">
							<img
								src={anime.pictureMedium}
								class="bg-center bg-cover w-full aspect-[225/350] rounded"
								alt="{anime.title} picture"
								loading="lazy"
							/>
							{#if isRecommended}
								<div
									class="gap-1 border absolute top-2 right-2 p-2 bg-gray-100 rounded-full flex items-center justify-center text-green-700"
									transition:fade={{ duration: 150 }}
								>
									<ThumbsUpIcon class="h-5" />
									<div class="text-xs font-medium">Recommended</div>
								</div>
							{/if}
						</div>
					</button>
				{:else}
					<a {href}>
						<img
							src={anime.pictureMedium}
							class="bg-center bg-cover w-full aspect-[225/350] rounded"
							alt="{anime.title} picture"
							loading="lazy"
						/>
					</a>
				{/if}

				<div class="h-11 overflow-ellipsis overflow-hidden text-sm font-medium text-gray-600">
					{#if recommendations}
						{anime.title}
					{:else}
						<a {href} target="_blank">
							{anime.title}
						</a>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
