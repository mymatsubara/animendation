<script lang="ts">
	import ThumbsUpIcon from '$lib/components/icons/ThumbsUpIcon.svelte';
	import type { AnimeStatus } from '$lib/trpc/routes/user';
	import { Badge, Indicator } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	export let title: string;
	export let pictureUrl: string | null;
	export let status: AnimeStatus | undefined = undefined;
	export let isRecommended = false;
</script>

<div class="relative">
	{#if pictureUrl}
		<img
			src={pictureUrl}
			class="object-cover w-full aspect-[225/318] rounded"
			alt="{title} picture"
			loading="lazy"
		/>
	{:else}
		<div
			class="gap-2 flex flex-col items-center justify-center bg-gray-300 w-full aspect-[225/318] rounded"
		>
			<div class="text-xl font-semibold">(⊙_⊙)</div>
			<div class="text-gray-600">No picture</div>
		</div>
	{/if}

	{#if isRecommended}
		<div class="absolute top-2 right-2" transition:fade={{ duration: 150 }}>
			<Badge class="p-2" color="green" rounded>
				<ThumbsUpIcon class="h-5 mr-1" />
				Recommended
			</Badge>
		</div>
	{/if}
	{#if status}
		<div transition:fade={{ duration: 150 }} class="absolute right-1 bottom-1">
			{#if status === 'completed'}
				<Badge rounded class="px-2.5 py-0.5" color="blue"
					><Indicator size="xs" class="mr-1" color="blue" />Completed</Badge
				>
			{:else if status === 'watching'}
				<Badge rounded class="px-2.5 py-0.5" color="green"
					><Indicator size="xs" class="mr-1" color="green" />Watching</Badge
				>
			{:else if status === 'plan_to_watch'}
				<Badge rounded class="px-2.5 py-0.5" color="dark"
					><Indicator size="xs" class="mr-1" color="dark" />Plan to watch</Badge
				>
			{:else if status === 'dropped'}
				<Badge rounded class="px-2.5 py-0.5" color="red"
					><Indicator size="xs" class="mr-1" color="red" />Dropped</Badge
				>
			{:else if status === 'on_hold'}
				<Badge rounded class="px-2.5 py-0.5" color="yellow"
					><Indicator size="xs" class="mr-1" color="yellow" />On hold</Badge
				>
			{/if}
		</div>
	{/if}
</div>
