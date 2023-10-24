<script lang="ts">
	import AnimeDisplay from '$lib/components/AnimeDisplay.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import Dropdown from '$lib/components/dropdown/Dropdown.svelte';
	import MultiSelect from '$lib/components/forms/MultiSelect.svelte';
	import MultiSelectChips from '$lib/components/forms/MultiSelectChips.svelte';
	import AdjustmentIcon from '$lib/components/icons/AdjustmentIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import type { Animelist } from '$lib/stores/animelist';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { AnimeStatus } from '$lib/trpc/routes/user';
	import { Badge, Button, Indicator, Input, Label, Toggle } from 'flowbite-svelte';
	import Fuse from 'fuse.js';
	import { fade } from 'svelte/transition';

	type Filter = {
		search?: string;
		hideSequels: boolean;
		status: AnimeStatus[];
		genres?: string[];
		years?: number[];
		seasons?: string[];
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

	const statusItems: StatusOption[] = [
		{ value: 'completed', name: 'Completed', color: 'blue' },
		{ value: 'watching', name: 'Watching', color: 'green' },
		{ value: 'plan_to_watch', name: 'Plan to watch', color: 'dark' },
		{ value: 'on_hold', name: 'On hold', color: 'yellow' },
		{ value: 'dropped', name: 'Dropped', color: 'red' },
		{ value: undefined as any, name: 'No status', color: 'gray' }
	];
	const seasonItems = [
		{ value: 'winter', name: 'Winter' },
		{ value: 'spring', name: 'Spring' },
		{ value: 'summer', name: 'Summer' },
		{ value: 'fall', name: 'Fall' }
	];

	let filter: Filter = {
		hideSequels: false,
		status: [],
		...startFilter
	};
	let showFilter = false;

	$: yearItems = (() => {
		const years = [
			...new Set(animes?.map((anime) => anime.seasonYear).filter((year) => year) as number[])
		];
		years.sort((y1, y2) => y2 - y1);
		return years.map((year) => ({ value: year, name: year }));
	})();
	$: genreItems = (() => {
		const genres = [...new Set(animes?.flatMap((anime) => anime.genres) ?? [])];
		genres.sort((g1, g2) => g1.localeCompare(g2));
		return genres.map((genre) => ({ value: genre, name: genre }));
	})();
	$: animesWithStatus =
		(animelist
			? animes?.map((anime) => ({ ...anime, status: animelist?.get(anime.id)?.status }))
			: animes) ?? [];
	$: fuzzySearch = new Fuse(animesWithStatus, {
		keys: ['title'],
		threshold: 0.3
	});
	$: filteredAnimes = filterAnimes(animesWithStatus, filter, fuzzySearch);

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

		if (filter.genres?.length) {
			const genres = new Set(filter.genres);
			animes = animes.filter((anime) => anime.genres.some((genre) => genres.has(genre)));
		}

		if (filter.status?.length) {
			const status = new Set(filter.status);
			animes = animes.filter((anime) => status.has(anime.status as any));
		}

		if (filter.years?.length) {
			const years = new Set(filter.years);
			animes = animes.filter((anime) => years.has(anime.seasonYear as number));
		}

		if (filter.seasons?.length) {
			const seasons = new Set(filter.seasons);
			animes = animes.filter((anime) => seasons.has(anime.season as string));
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

<div class="flex gap-5">
	<div class="grid md:grid-cols-2 lg:grid-cols-3 grow gap-5">
		<div>
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
		</div>

		<div class="hidden md:block">
			<MultiSelect
				class="bg-gray-50 border-0 shadow w-full"
				placeholder="Status"
				items={statusItems}
				bind:value={filter.status}
				let:item
				let:clear
			>
				<Badge
					class="border-2 border-transparent"
					rounded
					color={notypecheck(item).color}
					dismissable
					on:close={clear}
				>
					<Indicator color={notypecheck(item).color} size="xs" class="mr-1" /><span
						class="unselectable">{item.name}</span
					>
				</Badge>
			</MultiSelect>
		</div>

		<div class="hidden lg:block">
			<MultiSelect
				class="bg-gray-50 border-0 shadow w-full"
				placeholder="Genre"
				items={genreItems}
				bind:value={filter.genres}
			/>
		</div>
	</div>

	<div class="ml-2 mt-2 items-start hidden sm:flex">
		<Toggle
			class="whitespace-nowrap font-medium text-gray-500 w-max"
			bind:checked={filter.hideSequels}>Hide sequels</Toggle
		>
	</div>

	<div class="relative">
		<Dropdown class=" min-w-[min(calc(100vw-2.5rem),500px)] bg-white" bind:open={showFilter}>
			<svelte:fragment slot="button" let:toggle>
				<Button
					class="!p-1 aspect-square h-10 border-0 shadow"
					type="button"
					outline
					size="lg"
					on:click={toggle}><AdjustmentIcon class="h-6" /></Button
				>
			</svelte:fragment>

			<div slot="header" class="text-center py-2 font-bold">Filters</div>
			<div class="flex flex-col gap-4 pt-2 pb-4 px-4">
				<Toggle
					class="sm:hidden whitespace-nowrap font-medium text-gray-500 w-max"
					bind:checked={filter.hideSequels}>Hide sequels</Toggle
				>

				<div class="md:hidden text-sm font-medium text-gray-900 dark:text-gray-300">
					<div class="mb-1">Status</div>
					<MultiSelectChips items={statusItems} bind:values={filter.status} let:item let:checked>
						<Badge
							class="cursor-pointer border-2 border-transparent peer-checked:border-primary-700"
							rounded
							color={notypecheck(item).color}
						>
							<Indicator color={notypecheck(item).color} size="xs" class="mr-1" /><span
								class="unselectable">{item.name}</span
							>
						</Badge>
					</MultiSelectChips>
				</div>

				<Label class="lg:hidden">
					<div class="mb-1">Genre</div>
					<MultiSelect items={genreItems} bind:value={filter.genres} placeholder="Select genre" />
				</Label>

				<Label>
					<div class="mb-1">Year</div>
					<MultiSelect items={yearItems} bind:value={filter.years} placeholder="Select year" />
				</Label>

				<Label>
					<div class="mb-1">Season</div>
					<MultiSelect
						items={seasonItems}
						bind:value={filter.seasons}
						placeholder="Select season"
					/>
				</Label>
			</div>
		</Dropdown>
	</div>
</div>

<div
	class="grid gap-3 grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-5"
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
						type="button"
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
