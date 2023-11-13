<script lang="ts">
	import ArrowLeftIcon from '$lib/components/icons/ArrowLeftIcon.svelte';
	import EditRecommendations from '$lib/components/recommendations/EditRecommendations.svelte';
	import RecommendationList from '$lib/components/recommendations/RecommendationList.svelte';
	import type { Serie } from '$lib/components/recommendations/types';
	import { user } from '$lib/stores/user';
	import type { SerieType } from '$lib/types';

	export let username: string;
	export let myRecommendations: boolean;
	export let series: Serie[] | undefined;
	export let type: SerieType;

	let edit = false;
</script>

<section class="pb-2">
	<div class="flex gap-1 items-center">
		{#if edit}
			<button class="p-1" on:click={() => (edit = false)}><ArrowLeftIcon class="h-4" /></button>
		{/if}
		<h1 class="text-xl tracking-tight font-medium">
			{edit ? 'Edit recommendations' : 'Recommendations'}
		</h1>
		{#if username.toLocaleLowerCase() === $user?.username?.toLocaleLowerCase()}
			{#if !edit}
				<button
					class="px-3 rounded-full text-sm text-primary-500 font-medium"
					on:click={() => (edit = true)}
					aria-label={edit ? 'Save recommendations' : 'Edit recommendations'}
				>
					Edit
				</button>
			{/if}
		{/if}
	</div>

	<div class="mb-3">
		{#if !edit}
			<div class="mt-3">
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
			<div class="mt-3">
				<EditRecommendations {type} />
			</div>
		{/if}
	</div>
</section>
