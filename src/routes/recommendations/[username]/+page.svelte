<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { UsersService } from '$lib/clients/jikan/generated';
	import EditRecommendations from '$lib/components/EditRecommendations.svelte';
	import NoProfilePicture from '$lib/components/NoProfilePicture.svelte';
	import RecommendationList from '$lib/components/RecommendationList.svelte';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import PencilSquareIcon from '$lib/components/icons/PencilSquareIcon.svelte';
	import { user } from '$lib/stores/user';
	import { Tooltip } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	$: username = $page.params.username;
	$: userPromise = browser ? UsersService.getUserProfile(username) : undefined;
	const pictureClass = 'w-[100px] h-[100px] flex items-center justify-center';

	let edit = false;
</script>

<div class="bg-primary-800 w-full">
	<div class="flex gap-4 container items-end py-4">
		<div class={pictureClass}>
			{#if userPromise}
				{#await userPromise then user}
					{#if user?.data?.images?.webp?.image_url}
						<div
							transition:fade
							class="{pictureClass} rounded bg-top bg-no-repeat bg-cover"
							style="background-image: url({user.data.images.webp.image_url})"
						/>
					{:else}
						<NoProfilePicture />
					{/if}
				{:catch}
					<NoProfilePicture />
				{/await}
			{/if}
		</div>
		<h2 class="text-white text-2xl font-medium">{username}</h2>
	</div>
</div>

<div class="container mt-3">
	<div class="flex gap-1 items-center">
		<h1 class="text-xl tracking-tight font-medium">Recommendations</h1>
		{#if username.toLocaleLowerCase() === $user?.username?.toLocaleLowerCase()}
			<button class="p-2 hover:bg-gray-200 rounded-full" on:click={() => (edit = !edit)}>
				{#if !edit}
					<PencilSquareIcon class="h-4 text-gray-800" />
				{:else}
					<CheckIcon class="h-4 text-gray-800" />
				{/if}
			</button>
			{#if edit}
				<Tooltip>Save</Tooltip>
			{:else}
				<Tooltip>Edit</Tooltip>
			{/if}
		{/if}
	</div>

	<div class="mb-3">
		{#if !edit}
			<div class="mt-3">
				<RecommendationList {username} onAddRecommendations={() => (edit = true)} />
			</div>
		{:else if $user?.username}
			<div class="text-gray-500 text-sm">Click to recommend/unrecommend an anime</div>
			<div class="mt-3">
				<EditRecommendations username={$user.username} />
			</div>
		{/if}
	</div>
</div>
