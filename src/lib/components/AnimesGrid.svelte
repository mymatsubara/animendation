<script lang="ts">
	import AnimeDisplay from '$lib/components/AnimeDisplay.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import type { Animelist } from '$lib/stores/animelist';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import { Input } from 'flowbite-svelte';
	import Fuse from 'fuse.js';

	export let animes: AnimeInfo[] | undefined;
	export let recommendations:
		| {
				mine: Set<number>;
				add: (animeId: number) => Promise<void>;
				remove: (animeId: number) => Promise<void>;
		  }
		| undefined = undefined;
	export let animelist: Animelist | undefined = undefined;

	let filteredAnimes: AnimeInfo[];
	let search: string = '';

	$: fuzzySearch = new Fuse(animes ?? [], {
		keys: ['title'],
		threshold: 0.3
	});

	$: {
		if (animes) {
			if (search) {
				filteredAnimes = fuzzySearch.search(search).map(({ item }) => item);
			} else {
				filteredAnimes = animes;
			}
		}
	}

	let timeout: NodeJS.Timeout;
	function updateSearchDebounce(event: Event) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			search = (event.target as any)?.value ?? '';
		}, 300);
	}
</script>

<Input type="search" on:input={updateSearchDebounce} placeholder="Search" size="lg">
	<svelte:fragment slot="left">
		<SearchIcon class="h-5" />
	</svelte:fragment>
</Input>

<div
	class="grid gap-3 grid-cols-2 min-[470px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-5"
>
	{#if animes === undefined}
		{#each new Array(25).fill(0) as _}
			<div class="flex flex-col gap-2">
				<Placeholder class="rounded w-full aspect-[225/350]" />
				<Placeholder class="h-10 rounded" />
			</div>
		{/each}
	{:else}
		{#each filteredAnimes as anime (anime.id)}
			{@const isRecommended = recommendations?.mine?.has(anime.id)}
			{@const href = `https://myanimelist.net/anime/${anime.id}`}
			<div class="flex flex-col gap-1">
				{#if recommendations !== undefined}
					<button
						class="rounded w-full border hover:shadow-lg hover:border-2"
						on:click={() =>
							isRecommended ? recommendations?.remove(anime.id) : recommendations?.add(anime.id)}
					>
						<AnimeDisplay
							title={anime.title}
							pictureUrl={anime.pictureMedium}
							status={animelist?.[anime.id]?.status}
							{isRecommended}
						/>
					</button>
				{:else}
					<AnimeDisplay
						title={anime.title}
						pictureUrl={anime.pictureMedium}
						status={animelist?.[anime.id]?.status}
					/>
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
