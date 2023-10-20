<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { UsersService, type user_profile } from '$lib/clients/jikan/generated';
	import EditRecommendations from '$lib/components/EditRecommendations.svelte';
	import NoProfilePicture from '$lib/components/NoProfilePicture.svelte';
	import RecommendationList from '$lib/components/RecommendationList.svelte';
	import ArrowTopRightIcon from '$lib/components/icons/ArrowTopRightIcon.svelte';
	import CameraIcon from '$lib/components/icons/CameraIcon.svelte';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import ChevronUpIcon from '$lib/components/icons/ChevronUpIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import PencilSquareIcon from '$lib/components/icons/PencilSquareIcon.svelte';
	import { user } from '$lib/stores/user';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	const pictureClass = 'w-[100px] aspect-square flex items-center justify-center';

	let userProfile: user_profile | undefined = undefined;
	let edit = false;
	let scrollY: number;

	$: username = $page.params.username;
	$: isMe = $user?.username?.toLowerCase() === username.toLocaleLowerCase();
	$: {
		if (username && browser) {
			UsersService.getUserProfile(username).then((result) => (userProfile = result?.data));
		}
	}
	$: console.log({ scrollY });
</script>

<svelte:window bind:scrollY />

<div class="bg-gradient-to-t from-primary-900 to-primary-700 w-full">
	<div class="flex gap-4 container items-end py-4">
		<a
			href={isMe ? 'https://myanimelist.net/editprofile.php?go=picture' : undefined}
			class="{pictureClass} relative group"
			target="_blank"
		>
			{#if userProfile}
				{@const imageUrl = userProfile.images?.webp?.image_url}
				{#if imageUrl}
					<img
						transition:fade
						class="{pictureClass} rounded object-cover object-top shadow"
						src={imageUrl}
						alt="{userProfile.username}'s profile picture"
					/>
				{:else}
					<NoProfilePicture />
				{/if}
			{/if}
			{#if isMe}
				<div
					class="absolute bottom-1 right-1 hidden group-hover:block p-2 rounded-full bg-primary-50/50"
				>
					<CameraIcon class="h-4" />
				</div>
			{/if}
		</a>
		<div class="flex flex-col">
			<a
				class="flex gap-1 items-center py-1 text-primary-100 hover:text-white"
				href="https://myanimelist.net/profile/{username}"
				target="_blank"
				><MyanimelistLogoIcon class="h-3" /><ArrowTopRightIcon class="h-3 mb-[3px]" /></a
			>
			<h2 class="text-primary-50 text-xl font-medium">{userProfile?.username ?? username}</h2>
		</div>
	</div>
</div>

<section class="container mt-4">
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
</section>

{#if scrollY > 300}
	<div transition:fade={{ duration: 150 }} class="fixed bottom-5 right-5">
		<Button
			class="rounded-full aspect-square p-3"
			on:click={() =>
				window.scrollTo({
					top: 0,
					behavior: 'smooth'
				})}><ChevronUpIcon class="h-8 -translate-y-0.5" /></Button
		>
		<Tooltip class="whitespace-nowrap">Go to top</Tooltip>
	</div>
{/if}
