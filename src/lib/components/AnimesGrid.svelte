<script lang="ts">
	import AnimeDisplay from '$lib/components/AnimeDisplay.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import AdjustmentIcon from '$lib/components/icons/AdjustmentIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import type { Animelist } from '$lib/stores/animelist';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { AnimeStatus } from '$lib/trpc/routes/user';
	import {
		Badge,
		Button,
		Dropdown,
		Indicator,
		Input,
		Label,
		MultiSelect,
		Toggle
	} from 'flowbite-svelte';
	import Fuse from 'fuse.js';
	import { fade } from 'svelte/transition';

	type Filter = {
		search?: string;
		hideSequels: boolean;
		status: AnimeStatus[];
		checkStatus: boolean;
		genre?: string;
	};
	type AnimeWithStatus = AnimeInfo & { status?: AnimeStatus };
	type Fuzzy = typeof fuzzySearch;
	type StatusOption = {
		value: AnimeStatus;
		name: string;
		color: string;
	};

	export let animes: AnimeInfo[] | undefined;
	export let animelist: Animelist | undefined = undefined;
	export let recommendations:
		| {
				mine: Set<number>;
				add: (animeId: number) => Promise<void>;
				remove: (animeId: number) => Promise<void>;
		  }
		| undefined = undefined;
	export let startFilter: Partial<Filter> = {};

	const statusOptions: StatusOption[] = [
		{ value: 'completed', name: 'Completed', color: 'blue' },
		{ value: 'watching', name: 'Watching', color: 'green' },
		{ value: 'plan_to_watch', name: 'Plan to watch', color: 'dark' },
		{ value: 'on_hold', name: 'On hold', color: 'yellow' },
		{ value: 'dropped', name: 'Dropped', color: 'red' }
	];

	let filter: Filter = {
		hideSequels: false,
		status: ['watching', 'completed'],
		checkStatus: true,
		...startFilter
	};

	$: filter.checkStatus = animelist !== undefined;
	$: animesWithStatus =
		(animelist
			? animes?.map((anime) => ({ ...anime, status: animelist?.[anime.id]?.status }))
			: animes) ?? [];
	$: fuzzySearch = new Fuse(animesWithStatus, {
		keys: ['title'],
		threshold: 0.3
	});
	$: filteredAnimes = filterAnimes(animesWithStatus, filter, fuzzySearch);
	$: console.log({ filteredAnimes, animes, animesWithStatus, filter, animelist });

	function filterAnimes(
		animes: AnimeWithStatus[],
		filter: Filter,
		fuzzy: Fuzzy
	): AnimeWithStatus[] {
		if (filter.search) {
			animes = fuzzy.search(filter.search).map(({ item }) => item);
		}

		if (filter.hideSequels) {
			animes = animes.filter((anime) => !anime.isSequel);
		}

		const genre = filter.genre;
		if (genre) {
			animes = animes.filter((anime) => anime.genres.indexOf(genre) !== -1);
		}

		if (filter.checkStatus && filter.status?.length) {
			animes = animes.filter((anime) => anime.status && filter.status.indexOf(anime.status) !== -1);
		}

		return animes;
	}

	let timeout: NodeJS.Timeout;
	function updateSearchDebounce(event: Event) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			filter.search = (event.target as any)?.value ?? '';
			filter = filter;
		}, 300);
	}

	const notypecheck = (i: any) => i;
</script>

<div class="flex gap-4">
	<Input
		class="border-0 shadow"
		type="search"
		on:input={updateSearchDebounce}
		placeholder="Search"
		size="lg"
	>
		<svelte:fragment slot="left">
			<SearchIcon class="h-5" />
		</svelte:fragment>
	</Input>

	<div class="ml-4 items-center hidden sm:flex">
		<Toggle class="whitespace-nowrap font-medium text-gray-500" bind:checked={filter.hideSequels}
			>Hide sequels</Toggle
		>
	</div>

	<div>
		<Button outline size="lg" class="!p-1 aspect-square h-10 border-0 shadow" id="filter"
			><AdjustmentIcon class="h-6" /></Button
		>

		<Dropdown
			containerClass="divide-y z-50 min-w-[300px] max-w-sm sm:max-w-lg border shadow-lg"
			placement="bottom-end"
			triggeredBy="#filter"
		>
			<div slot="header" class="text-center py-2 font-bold">Filters</div>
			<div class="flex flex-col gap-4 py-2 px-4">
				<Toggle
					class="sm:hidden whitespace-nowrap font-medium text-gray-500"
					bind:checked={filter.hideSequels}>Hide sequels</Toggle
				>
				<Label class="relative">
					<div class="mb-1">Status</div>
					<MultiSelect
						class="min-h-[41px]"
						placeholder="No filter"
						items={statusOptions}
						bind:value={filter.status}
						let:item
						let:clear
					>
						<Badge
							rounded
							color={notypecheck(item).color}
							dismissable
							params={{ duration: 100 }}
							on:close={clear}
						>
							<Indicator color={notypecheck(item).color} size="xs" class="mr-1" />{item.name}
						</Badge>
					</MultiSelect>
					{#if !filter.status?.length}
						<div class="absolute bottom-2.5 left-2.5 text-gray-500">Select status</div>
					{/if}
				</Label>
			</div>
		</Dropdown>
	</div>
</div>

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

			<div transition:fade={{ duration: 150 }} class="flex flex-col gap-1">
				{#if recommendations !== undefined}
					<button
						class="rounded w-full border hover:shadow-lg hover:border-2"
						on:click={() =>
							isRecommended ? recommendations?.remove(anime.id) : recommendations?.add(anime.id)}
					>
						<AnimeDisplay
							title={anime.title}
							pictureUrl={anime.pictureMedium}
							status={anime.status}
							{isRecommended}
						/>
					</button>
				{:else}
					<AnimeDisplay
						title={anime.title}
						pictureUrl={anime.pictureMedium}
						status={anime.status}
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
