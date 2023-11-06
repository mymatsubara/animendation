<script lang="ts">
	import { statusDisplay } from '$lib/client/display';
	import type { AnimeStatus } from '$lib/clients/myanimelist';
	import CustomDropdown from '$lib/components/dropdown/CustomDropdown.svelte';
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
	import type { Myanimelist } from '$lib/stores/animelist';
	import { toast } from '$lib/stores/toast';
	import { unchecked } from '$lib/utils/types';
	import { Badge, Indicator } from 'flowbite-svelte';

	export let animeId: number;
	export let animelist: Myanimelist;

	$: status = $animelist?.get(animeId)?.status as AnimeStatus;
	$: display = statusDisplay[status] ?? { label: 'Add to list', color: 'gray' };

	async function changeStatus(newStatus: AnimeStatus | undefined, toggle: Function) {
		toggle();

		if (status === newStatus) {
			return;
		}

		if (newStatus === undefined) {
			await animelist.remove(animeId);
		} else {
			await animelist.upsert(animeId, newStatus);
		}
		$toast = {
			message: 'Anime status updated',
			level: 'success',
		};
	}
</script>

<CustomDropdown class="-bottom-1" let:toggle>
	<svelte:fragment slot="button" let:toggle>
		<button class="w-max p-2 group" on:click={toggle}>
			<Badge rounded class="px-2.5 py-0.5 group-focus:ring-2" color={display.color}>
				{#if status}
					<Indicator size="xs" class="mr-1" color={unchecked(display.color)} />{:else}
					<PlusIcon stroke-width="2.0" class="h-3 mr-1" />
				{/if}{display.label}
				<ChevronDownIcon class="ml-1 h-3" /></Badge
			>
		</button>
	</svelte:fragment>

	<div class="flex flex-col w-max">
		{#each Object.entries(statusDisplay) as [value, display] (value)}
			{@const color = display.color === 'dark' ? 'gray' : display.color}
			<button
				class="flex items-center p-2 hover:bg-{color}-100 text-{color}-800 focus:ring-2 text-xs font-medium {status ===
				value
					? `bg-${color}-100`
					: ''}"
				on:click={() => changeStatus(unchecked(value), toggle)}
			>
				<Indicator size="xs" class="mr-2" color={unchecked(display.color)} />
				{display.label}
			</button>
		{/each}
		{#if status !== undefined}
			<button
				class="flex items-center p-2 hover:bg-red-100 text-red-800 text-xs font-medium"
				on:click={() => changeStatus(undefined, toggle)}
			>
				<CloseIcon class="h-3 mr-2" />
				Remove from list
			</button>
		{/if}
	</div>
</CustomDropdown>
