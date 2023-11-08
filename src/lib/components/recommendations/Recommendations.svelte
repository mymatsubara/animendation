<script lang="ts">
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import PencilSquareIcon from '$lib/components/icons/PencilSquareIcon.svelte';
	import EditRecommendations from '$lib/components/recommendations/EditRecommendations.svelte';
	import RecommendationList from '$lib/components/recommendations/RecommendationList.svelte';
	import type { Serie } from '$lib/components/recommendations/types';
	import { user } from '$lib/stores/user';
	import type { SerieType } from '$lib/types';
	import { Button, Tooltip } from 'flowbite-svelte';

	export let username: string;
	export let myRecommendations: boolean;
	export let series: Serie[] | undefined;
	export let type: SerieType;

	let edit = false;
</script>

<section class="pb-2">
	<div class="flex gap-1 items-center">
		<h1 class="text-xl tracking-tight font-medium">
			{edit ? 'Edit recommendations' : 'Recommendations'}
		</h1>
		{#if username.toLocaleLowerCase() === $user?.username?.toLocaleLowerCase()}
			<Button
				outline
				class="border-0 p-3 hover:bg-gray-200 rounded-full"
				on:click={() => (edit = !edit)}
			>
				{#if !edit}
					<PencilSquareIcon class="h-4 text-gray-800" />
				{:else}
					<CheckIcon class="h-4 text-gray-800" />
				{/if}
			</Button>
			{#if edit}
				<Tooltip>Save</Tooltip>
			{:else}
				<Tooltip>Edit</Tooltip>
			{/if}
		{/if}
	</div>

	<div class="mb-3">
		{#if !edit}
			<div class="mt-1">
				<RecommendationList
					{series}
					{type}
					{myRecommendations}
					onAddRecommendations={() => (edit = true)}
				/>
			</div>
		{:else if $user?.username}
			<div class="text-gray-500 text-sm">
				Click on the heart to recommend/unrecommend an {type.toLocaleLowerCase()}
			</div>
			<div class="mt-1">
				<EditRecommendations {type} />
			</div>
		{/if}
	</div>
</section>
