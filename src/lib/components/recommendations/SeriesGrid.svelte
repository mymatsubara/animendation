<script lang="ts">
	import { animeStatusDisplay, mangaStatusDisplay } from '$lib/client/display';
	import { AnimeService, MangaService, anime, manga } from '$lib/clients/jikan/generated';
	import type { AnimeStatus, MangaStatus } from '$lib/clients/myanimelist';
	import AnimeDisplay from '$lib/components/AnimeDisplay.svelte';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import CustomDropdown from '$lib/components/dropdowns/CustomDropdown.svelte';
	import MultiSelectAutocomplete from '$lib/components/forms/MultiSelectAutocomplete.svelte';
	import MultiSelectChips from '$lib/components/forms/MultiSelectChips.svelte';
	import AdjustmentIcon from '$lib/components/icons/AdjustmentIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import HeartIcon from '$lib/components/icons/HeartIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import VerticalEllipsisIcon from '$lib/components/icons/VerticalEllipsisIcon.svelte';
	import { getMyanimelist, type Lists } from '$lib/stores/animelist';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { MangaInfo } from '$lib/trpc/routes/manga';
	import type { SerieType } from '$lib/types';
	import { titleCase } from '$lib/utils/string';
	import {
		Badge,
		Button,
		Dropdown,
		DropdownItem,
		Indicator,
		Input,
		Spinner,
		Toggle,
	} from 'flowbite-svelte';
	import Fuse from 'fuse.js';
	import { fade } from 'svelte/transition';

	type SerieStatus = AnimeStatus | MangaStatus;
	type Filter = {
		search?: string;
		hideSequels: boolean;
		status?: Set<SerieStatus>;
		genres?: Set<string>;
		years?: Set<number>;
		seasons?: Set<string>;
		mediaTypes?: Set<string>;
	};
	type SerieWitStatus = Serie & { status?: SerieStatus };
	type Fuzzy = typeof fuzzySearch;
	type StatusOption = {
		value: SerieStatus;
		label: string;
		color: string;
	};
	type Serie = AnimeInfo | MangaInfo;

	export let series: Serie[] | undefined;
	export let type: SerieType;
	export let startFilter: Partial<Filter> = {};
	export let recommend = false;

	const myanimelist = getMyanimelist();
	const recommendations = getMyRecommendations();
	const statusDisplay = type === 'Anime' ? animeStatusDisplay : mangaStatusDisplay;
	const statusOptions: StatusOption[] = Object.entries(statusDisplay).map(
		([value, { label, color }]) => ({ value: value as SerieStatus, color: color as string, label })
	);
	const seasonOptions = [
		{ value: 'winter', label: 'Winter' },
		{ value: 'spring', label: 'Spring' },
		{ value: 'summer', label: 'Summer' },
		{ value: 'fall', label: 'Fall' },
	];

	let filter: Filter = {
		hideSequels: false,
		...startFilter,
	};
	let showFilter = false;
	let loadingMal = false;
	let malHasNextPage = true;
	let malPageNumber = 1;
	let loadingRecommendations = new Set<number>();

	$: {
		if (filter) {
			malPageNumber = 1;
			malHasNextPage = true;
		}
	}

	$: yearOptions = (() => {
		if (type === 'Anime') {
			const years = [
				...new Set(
					series?.map((anime) => (anime as AnimeInfo).seasonYear).filter((year) => year) as number[]
				),
			];
			years.sort((y1, y2) => y2 - y1);
			return years.map((year) => ({ value: year, label: year.toString() }));
		}
	})();
	$: genreOptions = (() => {
		const genres = [...new Set(series?.flatMap((serie) => serie.genres) ?? [])];
		genres.sort((g1, g2) => g1.localeCompare(g2));
		return genres.map((genre) => ({ value: genre, label: genre }));
	})();
	$: mediaOptions = (() => {
		if (type === 'Anime') {
			const genres = [...new Set(series?.flatMap((anime) => anime.mediaType) ?? [])];
			genres.sort((g1, g2) => g1.localeCompare(g2));
			return genres.map((genre) => ({ value: genre, label: titleCase(genre) }));
		}
	})();
	$: animesWithStatus = addStatus(series ?? [], $myanimelist, type);
	$: fuzzySearch = new Fuse(animesWithStatus, {
		keys: ['title'],
		threshold: 0.3,
	});
	$: filteredSeries = filterSeries(animesWithStatus, filter, fuzzySearch);

	function addStatus(
		series: Serie[],
		myanimelist: Lists | undefined,
		type: SerieType
	): SerieWitStatus[] {
		const list = type === 'Anime' ? myanimelist?.animelist : myanimelist?.mangalist;

		return myanimelist
			? series?.map((serie) => ({ ...serie, status: list?.get(serie.id)?.status }))
			: series;
	}

	function filterSeries(series: SerieWitStatus[], filter: Filter, fuzzy: Fuzzy): SerieWitStatus[] {
		if (filter.search) {
			series = fuzzy.search(filter.search).map(({ item }) => item);
		}

		if (filter.hideSequels && type === 'Anime') {
			series = series.filter((anime) => !(anime as AnimeInfo).isSequel);
		}

		if (filter.genres?.size) {
			series = series.filter((serie) => serie.genres.some((genre) => filter.genres?.has(genre)));
		}

		if (filter.status?.size) {
			series = series.filter((serie) => filter.status?.has(serie.status as any));
		}

		if (filter.years?.size && type === 'Anime') {
			series = series.filter((anime) =>
				filter.years?.has((anime as AnimeInfo).seasonYear as number)
			);
		}

		if (filter.seasons?.size && type === 'Anime') {
			series = series.filter((anime) => filter.seasons?.has((anime as AnimeInfo).season as string));
		}

		if (filter.mediaTypes?.size) {
			series = series.filter((serie) => filter.seasons?.has(serie.mediaType as string));
		}

		return series;
	}

	async function toggleRecommendation(serieId: number, type: SerieType) {
		const prop = type === 'Anime' ? 'animes' : 'mangas';

		try {
			loadingRecommendations.add(serieId);
			loadingRecommendations = loadingRecommendations;

			if ($recommendations?.[prop].has(serieId)) {
				await recommendations.remove(serieId, type);
			} else {
				await recommendations.add(serieId, type);
			}
		} catch (e) {
			console.error(e);
			$toast = {
				message: 'Could not modify recommendation. Please try again',
				level: 'error',
			};
		} finally {
			loadingRecommendations.delete(serieId);
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
			const series =
				type === 'Anime'
					? await AnimeService.getAnimeSearch(undefined, malPageNumber, limit, filter.search)
					: await MangaService.getMangaSearch(undefined, malPageNumber, limit, filter.search);
			malPageNumber += 1;
			malHasNextPage = series.pagination?.has_next_page ?? false;

			if (series.data) {
				const m = Number.MAX_SAFE_INTEGER;
				series.data.sort((a1, a2) => (a1.popularity ?? m) - (a2.popularity ?? m));
				const filteredIds = new Set(filteredSeries.map((anime) => anime.id));
				const foundSeries: Serie[] = series.data
					.filter((serie) => !filteredIds.has(serie.mal_id as number))
					.map((serie) => ({
						id: serie.mal_id ?? 0,
						genres: serie.genres?.map((genre) => genre.name ?? '') ?? [],
						title: serie.title ?? 'No title',
						isSequel: null,
						mediaType: serie.type ?? 'Unknown',
						nsfw: 'white',
						pictureLarge:
							serie.images?.webp?.large_image_url ?? serie.images?.webp?.image_url ?? null,
						season: (serie as anime).season ?? null,
						seasonYear: (serie as anime).year ?? null,
						chapters: (serie as manga).chapters ?? null,
						volumes: (serie as manga).volumes ?? null,
					}));

				filteredSeries = filteredSeries.concat(addStatus(foundSeries, $myanimelist, type));
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
			mediaTypes: new Set(),
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

				{#if yearOptions}
					<fieldset>
						<label for="yearFilter">Year</label>
						<MultiSelectAutocomplete
							id="yearFilter"
							options={yearOptions}
							bind:values={filter.years}
							placeholder="Select years"
						/>
					</fieldset>
				{/if}

				<fieldset>
					<label for="seasonFilter">Season</label>
					<MultiSelectAutocomplete
						id="seasonFilter"
						options={seasonOptions}
						bind:values={filter.seasons}
						placeholder="Select season"
					/>
				</fieldset>

				{#if mediaOptions}
					<fieldset>
						<label for="mediaFilter">Media type</label>
						<MultiSelectAutocomplete
							id="mediaFilter"
							options={mediaOptions}
							bind:values={filter.mediaTypes}
							placeholder="Select media type"
						/>
					</fieldset>
				{/if}
			</div>
		</CustomDropdown>
	</div>
</div>

<div
	class="grid gap-3 grid-cols-2 min-[550px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-5"
>
	{#if series === undefined}
		{#each new Array(25).fill(0) as _}
			<div class="flex flex-col gap-2">
				<Placeholder class="rounded w-full aspect-[225/350]" />
				<Placeholder class="h-10 rounded" />
			</div>
		{/each}
	{:else}
		{#each filteredSeries as serie (serie.id)}
			{@const statusHandler = $myanimelist
				? { serieId: serie.id, animelist: myanimelist, type }
				: undefined}
			{@const isRecommended = $recommendations?.[type === 'Anime' ? 'animes' : 'mangas'].has(
				serie.id
			)}
			{@const isLoading = loadingRecommendations.has(serie.id)}

			<div transition:fade={{ duration: 150 }} class="flex flex-col gap-1">
				{#if recommend}
					<div class="relative">
						<AnimeDisplay title={serie.title} pictureUrl={serie.pictureLarge} {statusHandler} />
						<div class="absolute top-2 right-2">
							<button
								class="rounded-lg focus:ring-2 p-3 flex items-center justify-center h-11 min-w-[2.75rem] {isRecommended
									? 'bg-primary-600'
									: 'bg-primary-800'}"
								on:click={() => toggleRecommendation(serie.id, type)}
								disabled={isLoading}
								title={isRecommended ? 'Click to unrecommend' : 'Click to recommend'}
							>
								{#if isLoading}
									<div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
										<Spinner size="4" />
									</div>
								{:else}
									<HeartIcon
										class="text-primary-50 {isRecommended ? 'fill-primary-50' : ''} h-5"
									/>{#if isRecommended}<span class="ml-2 text-xs font-medium text-primary-50"
											>Recommended</span
										>{/if}
								{/if}
							</button>
						</div>
					</div>
				{:else}
					<AnimeDisplay title={serie.title} pictureUrl={serie.pictureLarge} {statusHandler} />
				{/if}

				<div class="h-11 flex justify-between items-start gap-1">
					<div title={serie.title} class="h-11 overflow-hidden text-sm font-medium text-gray-600">
						{#if !recommend}
							<a href="https://myanimelist.net/anime/{serie.id}" target="_blank">
								{serie.title}
							</a>
						{:else}
							<div>{serie.title}</div>
						{/if}
					</div>
					{#if $user}
						<button class="px-2 pt-0.5 pb-2 text-primary-700"
							><VerticalEllipsisIcon class="h-5" /></button
						>
						<Dropdown placement="bottom-end">
							<DropdownItem
								class={isRecommended ? 'text-red-700' : 'text-primary-700'}
								on:click={() => toggleRecommendation(serie.id, type)}
								>{isRecommended ? 'Unrecommend' : 'Recommend'}</DropdownItem
							>
						</Dropdown>
					{/if}
				</div>
			</div>
		{/each}

		{#if recommend && filter.search && filteredSeries.length > 0 && malHasNextPage}
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

{#if series !== undefined && filteredSeries.length === 0}
	<div in:fade={{ duration: 150 }} class="flex flex-col items-center justify-center gap-2">
		<div class="font-bold text-3xl">(ಠ.ಠ)</div>
		<div class="text-gray-600">No {type.toLocaleLowerCase()} found</div>
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
			<div class="text-sm text-gray-400">Search: {filter.search ?? '""'}</div>
		{/if}
	</div>
{/if}
