<script lang="ts">
	import { AnimeService } from '$lib/clients/jikan/generated';
	import AnimeDisplay from '$lib/components/AnimeDisplay.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import CustomDropdown from '$lib/components/dropdown/CustomDropdown.svelte';
	import MultiSelectAutocomplete from '$lib/components/forms/MultiSelectAutocomplete.svelte';
	import MultiSelectChips from '$lib/components/forms/MultiSelectChips.svelte';
	import AdjustmentIcon from '$lib/components/icons/AdjustmentIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import VerticalEllipsisIcon from '$lib/components/icons/VerticalEllipsisIcon.svelte';
	import type { Animelist } from '$lib/stores/animelist';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { AnimeStatus } from '$lib/trpc/routes/user';
	import { titleCase } from '$lib/utils/string';
	import {
		Badge,
		Button,
		Dropdown,
		DropdownItem,
		Indicator,
		Input,
		Spinner,
		Toggle
	} from 'flowbite-svelte';
	import Fuse from 'fuse.js';
	import { fade } from 'svelte/transition';

	type Filter = {
		search?: string;
		hideSequels: boolean;
		status?: Set<AnimeStatus>;
		genres?: Set<string>;
		years?: Set<number>;
		seasons?: Set<string>;
		mediaTypes?: Set<string>;
	};
	type AnimeWithStatus = AnimeInfo & { status?: AnimeStatus };
	type Fuzzy = typeof fuzzySearch;
	type StatusOption = {
		value: AnimeStatus;
		label: string;
		color: string;
	};

	export let animes: AnimeInfo[] | undefined;
	export let animelist: Animelist | undefined = undefined;
	export let startFilter: Partial<Filter> = {};
	export let recommend = false;

	const recommendations = getMyRecommendations();
	const statusOptions: StatusOption[] = [
		{ value: 'completed', label: 'Completed', color: 'blue' },
		{ value: 'watching', label: 'Watching', color: 'green' },
		{ value: 'plan_to_watch', label: 'Plan to watch', color: 'dark' },
		{ value: 'on_hold', label: 'On hold', color: 'yellow' },
		{ value: 'dropped', label: 'Dropped', color: 'red' },
		{ value: undefined as any, label: 'No status', color: 'gray' }
	];
	const seasonOptions = [
		{ value: 'winter', label: 'Winter' },
		{ value: 'spring', label: 'Spring' },
		{ value: 'summer', label: 'Summer' },
		{ value: 'fall', label: 'Fall' }
	];

	let filter: Filter = {
		hideSequels: false,
		...startFilter
	};
	let showFilter = false;
	let loadingMal = false;
	let malHasNextPage = true;
	let malPage = 1;
	let loadingRecommendations = new Set<number>();

	$: {
		if (filter) {
			malPage = 1;
			malHasNextPage = true;
		}
	}

	$: yearOptions = (() => {
		const years = [
			...new Set(animes?.map((anime) => anime.seasonYear).filter((year) => year) as number[])
		];
		years.sort((y1, y2) => y2 - y1);
		return years.map((year) => ({ value: year, label: year.toString() }));
	})();
	$: genreOptions = (() => {
		const genres = [...new Set(animes?.flatMap((anime) => anime.genres) ?? [])];
		genres.sort((g1, g2) => g1.localeCompare(g2));
		return genres.map((genre) => ({ value: genre, label: genre }));
	})();
	$: mediaOptions = (() => {
		const genres = [...new Set(animes?.flatMap((anime) => anime.mediaType) ?? [])];
		genres.sort((g1, g2) => g1.localeCompare(g2));
		return genres.map((genre) => ({ value: genre, label: titleCase(genre) }));
	})();
	$: animesWithStatus = addStatus(animes ?? [], animelist);
	$: fuzzySearch = new Fuse(animesWithStatus, {
		keys: ['title'],
		threshold: 0.3
	});
	$: filteredAnimes = filterAnimes(animesWithStatus, filter, fuzzySearch);

	function addStatus(animes: AnimeInfo[], animelist: Animelist | undefined): AnimeWithStatus[] {
		return animelist
			? animes?.map((anime) => ({ ...anime, status: animelist?.get(anime.id)?.status }))
			: animes;
	}

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

		if (filter.genres?.size) {
			animes = animes.filter((anime) => anime.genres.some((genre) => filter.genres?.has(genre)));
		}

		if (filter.status?.size) {
			animes = animes.filter((anime) => filter.status?.has(anime.status as any));
		}

		if (filter.years?.size) {
			animes = animes.filter((anime) => filter.years?.has(anime.seasonYear as number));
		}

		if (filter.seasons?.size) {
			animes = animes.filter((anime) => filter.seasons?.has(anime.season as string));
		}

		if (filter.mediaTypes?.size) {
			animes = animes.filter((anime) => filter.seasons?.has(anime.mediaType as string));
		}

		return animes;
	}

	async function toggleRecommendation(animeId: number) {
		try {
			loadingRecommendations.add(animeId);
			loadingRecommendations = loadingRecommendations;

			if ($recommendations?.has(animeId)) {
				await recommendations.remove(animeId);
			} else {
				await recommendations.add(animeId);
			}
		} catch {
			$toast = {
				message: 'Could not modify anime recommendation. Please try again',
				level: 'error'
			};
		} finally {
			loadingRecommendations.delete(animeId);
			loadingRecommendations = loadingRecommendations;
		}
	}

	let timeout: NodeJS.Timeout;
	function updateSearchDebounce(event: Event) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			filter.search = (event.target as any)?.value ?? '';
			filter = filter;
		}, 500);
	}

	async function searchOnMyanimelist() {
		loadingMal = true;
		try {
			const limit = 25;
			const animes = await AnimeService.getAnimeSearch(undefined, malPage, limit, filter.search);
			malPage += 1;
			malHasNextPage = animes.pagination?.has_next_page ?? false;

			if (animes.data) {
				const m = Number.MAX_SAFE_INTEGER;
				animes.data.sort((a1, a2) => (a1.popularity ?? m) - (a2.popularity ?? m));
				const filteredIds = new Set(filteredAnimes.map((anime) => anime.id));
				const foundAnimes: AnimeInfo[] = animes.data
					.filter((anime) => !filteredIds.has(anime.mal_id as number))
					.map((anime) => ({
						id: anime.mal_id ?? 0,
						genres: anime.genres?.map((genre) => genre.name ?? '') ?? [],
						title: anime.title ?? 'No title',
						isSequel: null,
						mediaType: anime.type ?? 'Unknown',
						nsfw: 'white',
						pictureLarge:
							anime.images?.webp?.large_image_url ?? anime.images?.webp?.image_url ?? null,
						season: anime.season ?? null,
						seasonYear: anime.year ?? null
					}));

				filteredAnimes = filteredAnimes.concat(addStatus(foundAnimes, animelist));
			}
		} finally {
			loadingMal = false;
		}
	}

	function clearFilter() {
		filter = {
			search: filter.search,
			hideSequels: false,
			status: new Set(),
			genres: new Set(),
			seasons: new Set(),
			years: new Set(),
			mediaTypes: new Set()
		};
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
			<MultiSelectAutocomplete
				class="border-transparent shadow"
				options={statusOptions}
				bind:values={filter.status}
				placeholder="Status"
				let:option
			>
				<Badge
					class="border-2 border-transparent hover:shadow"
					rounded
					color={notypecheck(option.color)}
				>
					<Indicator color={notypecheck(option.color)} size="xs" class="mr-1" /><span
						class="unselectable">{option.label}</span
					><CloseIcon stroke-width="2.5" class="h-3 ml-1" />
				</Badge>
			</MultiSelectAutocomplete>
		</div>

		<div class="hidden lg:block">
			<MultiSelectAutocomplete
				class="bg-gray-50 border-0 shadow"
				placeholder="Genres"
				options={genreOptions}
				bind:values={filter.genres}
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
		<CustomDropdown class=" min-w-[min(calc(100vw-1.5rem),500px)] bg-white" bind:open={showFilter}>
			<svelte:fragment slot="button" let:toggle>
				<Button
					class="!p-1 aspect-square h-10 border-0 shadow"
					type="button"
					outline
					size="lg"
					on:click={toggle}
					><AdjustmentIcon class="h-6" />
				</Button>
			</svelte:fragment>

			<div class="grid grid-cols-3 items-baseline" slot="header">
				<span />
				<div class="text-center py-2 font-bold">Filters</div>
				<div class="ml-auto mr-3">
					<button class="relative text-sm font-medium text-primary-700 p-2" on:click={clearFilter}
						>Clear all
					</button>
				</div>
			</div>
			<div class="flex flex-col gap-4 pt-2 pb-4 px-4">
				<Toggle
					class="sm:hidden whitespace-nowrap font-medium text-gray-500 w-max"
					bind:checked={filter.hideSequels}>Hide sequels</Toggle
				>

				<div class="md:hidden text-sm font-medium text-gray-900 dark:text-gray-300">
					<div class="mb-1">Status</div>
					<MultiSelectChips
						options={statusOptions}
						bind:values={filter.status}
						let:option
						let:checked
					>
						<Badge
							class={checked ? 'outline outline-2 outline-primary-600' : ''}
							rounded
							color={notypecheck(option.color)}
						>
							<Indicator color={notypecheck(option.color)} size="xs" class="mr-1" /><span
								class="unselectable">{option.label}</span
							>
						</Badge>
					</MultiSelectChips>
				</div>

				<fieldset class="lg:hidden">
					<label for="genreFilter">Genre</label>
					<MultiSelectAutocomplete
						id="genreFilter"
						options={genreOptions}
						bind:values={filter.genres}
						placeholder="Select genres"
					/>
				</fieldset>

				<fieldset>
					<label for="yearFilter">Year</label>
					<MultiSelectAutocomplete
						id="yearFilter"
						options={yearOptions}
						bind:values={filter.years}
						placeholder="Select years"
					/>
				</fieldset>

				<fieldset>
					<label for="seasonFilter">Season</label>
					<MultiSelectAutocomplete
						id="seasonFilter"
						options={seasonOptions}
						bind:values={filter.seasons}
						placeholder="Select season"
					/>
				</fieldset>

				<fieldset>
					<label for="mediaFilter">Media type</label>
					<MultiSelectAutocomplete
						id="mediaFilter"
						options={mediaOptions}
						bind:values={filter.mediaTypes}
						placeholder="Select media type"
					/>
				</fieldset>
			</div>
		</CustomDropdown>
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
			{@const isRecommended = $recommendations?.has(anime.id)}
			{@const isLoading = loadingRecommendations.has(anime.id)}

			<div transition:fade={{ duration: 150 }} class="flex flex-col gap-1">
				{#if recommend}
					<button
						type="button"
						class="rounded w-full border hover:shadow-lg hover:border-2 relative {isLoading
							? 'brightness-75'
							: ''}"
						on:click={() => toggleRecommendation(anime.id)}
						disabled={isLoading}
					>
						<AnimeDisplay
							title={anime.title}
							pictureUrl={anime.pictureLarge}
							status={anime.status}
							{isRecommended}
						/>
						{#if isLoading}
							<div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
								<Spinner size="14" />
							</div>
						{/if}
					</button>
				{:else}
					<AnimeDisplay title={anime.title} pictureUrl={anime.pictureLarge} status={anime.status} />
				{/if}

				<div class="h-11 flex justify-between items-start gap-1">
					<div title={anime.title} class="h-11 overflow-hidden text-sm font-medium text-gray-600">
						{#if !recommend}
							<a href="https://myanimelist.net/anime/{anime.id}" target="_blank">
								{anime.title}
							</a>
						{:else}
							<div>{anime.title}</div>
						{/if}
					</div>
					{#if $user}
						<button class="px-2 pt-0.5 pb-2 text-primary-700"
							><VerticalEllipsisIcon class="h-5" /></button
						>
						<Dropdown placement="bottom-end">
							<DropdownItem
								class={isRecommended ? 'text-red-700' : 'text-primary-700'}
								on:click={() => toggleRecommendation(anime.id)}
								>{isRecommended ? 'Unrecommend' : 'Recommend'}</DropdownItem
							>
						</Dropdown>
					{/if}
				</div>
			</div>
		{/each}

		{#if recommend && filter.search && filteredAnimes.length > 0 && malHasNextPage}
			<Button
				disabled={loadingMal}
				class="w-full grow flex flex-col items-center justify-center gap-2 aspect-[225/318]"
				type="button"
				on:click={searchOnMyanimelist}
			>
				{#if loadingMal}
					<Spinner size="10" />
				{:else}
					<SearchIcon stroke-width="2.0" class="h-10" />
				{/if}
				<div>Search on <MyanimelistLogoIcon class="h-4" /></div>
				<div class="text-sm text-primary-300">Search: {filter.search}</div>
			</Button>
		{/if}
	{/if}
</div>

{#if animes !== undefined && filteredAnimes.length === 0}
	<div in:fade={{ duration: 150 }} class="flex flex-col items-center justify-center gap-2">
		<div class="font-bold text-3xl">(ಠ.ಠ)</div>
		<div class="text-gray-600">No animes found</div>
		{#if recommend}
			<Button disabled={loadingMal} type="button" class="mt-1 flex" on:click={searchOnMyanimelist}>
				{#if loadingMal}
					<Spinner size="5" class="mr-2" />
				{:else}
					<SearchIcon class="h-5 mr-2" />
				{/if}
				<span class="whitespace-nowrap mr-1.5">Search on </span><MyanimelistLogoIcon
					class="h-4 mt-0.5"
				/></Button
			>
			<div class="text-sm text-gray-400">Search: {filter.search}</div>
		{/if}
	</div>
{/if}
