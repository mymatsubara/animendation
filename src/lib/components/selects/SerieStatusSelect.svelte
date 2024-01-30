<script lang="ts">
	import { animeStatusDisplay, mangaStatusDisplay } from '$lib/client/display';
	import type { AnimeStatus, MangaStatus } from '$lib/clients/myanimelist';
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
	import type { Myanimelist } from '$lib/stores/animelist';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import type { SerieType } from '$lib/types';
	import { unchecked } from '$lib/utils/types';
	import { Badge, Dropdown, Indicator } from 'flowbite-svelte';

	export let serieId: number;
	export let animelist: Myanimelist;
	export let type: SerieType;

	let open = false;
	const displayMap = type === 'Anime' ? animeStatusDisplay : mangaStatusDisplay;
	$: status =
		type === 'Anime'
			? $animelist?.animelist.get(serieId)?.status
			: $animelist?.mangalist.get(serieId)?.status;

	$: display = (displayMap as any)[status as string] ?? { label: 'Add to list', color: 'gray' };

	async function changeStatus(newStatus: AnimeStatus | MangaStatus | undefined) {
		if (status === newStatus) {
			return;
		}

		if (newStatus === undefined) {
			await animelist.remove(serieId, type, $user?.username ?? '');
		} else {
			await animelist.upsert(serieId, { type, status: newStatus as any });
		}
		$toast = {
			message: `${type} status updated`,
			level: 'success',
		};
	}
</script>

<div>
	<button class="w-max p-2 group">
		<Badge class="rounded-md px-2.5 py-0.5 group-focus:ring-2" color={display.color}>
			{#if status}
				<Indicator size="xs" class="mr-1" color={unchecked(display.color)} />{:else}
				<PlusIcon stroke-width="2.0" class="h-3 mr-1" />
			{/if}{display.label}
			<ChevronDownIcon class="ml-1 h-3" /></Badge
		>
	</button>

	<Dropdown class="border border-gray-300 rounded-lg" offset={0} placement="bottom-end" bind:open>
		<div class="flex flex-col w-max">
			{#each Object.entries(displayMap) as [value, display] (value)}
				{@const color = display.color === 'dark' ? 'gray' : display.color}
				<button
					class="flex items-center px-3 py-2 hover:bg-{color}-100 text-{color}-800 focus:ring-2 text-xs font-medium {status ===
					value
						? `bg-${color}-100`
						: ''}"
					on:click={() => {
						changeStatus(unchecked(value));
						open = false;
					}}
				>
					<Indicator size="xs" class="mr-2" color={unchecked(display.color)} />
					{display.label}
				</button>
			{/each}
			{#if status !== undefined}
				<button
					class="flex items-center px-3 py-2 hover:bg-red-100 text-red-800 text-xs font-medium"
					on:click={() => {
						changeStatus(undefined);
						open = false;
					}}
				>
					<CloseIcon class="h-3 mr-2" />
					Remove from list
				</button>
			{/if}
		</div>
	</Dropdown>
</div>
