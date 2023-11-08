<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getAnimes } from '$lib/client/animes';
	import { getMangas } from '$lib/client/mangas';
	import { getRecommendations } from '$lib/client/recommendations';
	import { UsersService, type user_profile } from '$lib/clients/jikan/generated';
	import NoProfilePicture from '$lib/components/NoProfilePicture.svelte';
	import ArrowTopRightIcon from '$lib/components/icons/ArrowTopRightIcon.svelte';
	import CameraIcon from '$lib/components/icons/CameraIcon.svelte';
	import ChevronUpIcon from '$lib/components/icons/ChevronUpIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import Recommendations from '$lib/components/recommendations/Recommendations.svelte';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import { user } from '$lib/stores/user';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { MangaInfo } from '$lib/trpc/routes/manga';
	import { Button, Spinner, TabItem, Tabs, Tooltip } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	const pictureClass = 'w-[100px] aspect-square flex items-center justify-center';

	let userProfile: user_profile | null | undefined = undefined;
	let scrollY: number;
	let showSpinner = false;

	setTimeout(() => (showSpinner = true), 300);
	const username = $page.params.username;
	$: isMe = $user?.username?.toLowerCase() === username.toLocaleLowerCase();
	$: displayUsername = userProfile?.username ?? username;
	$: {
		if (username && browser) {
			UsersService.getUserProfile(username)
				.then((result) => (userProfile = result?.data ?? null))
				.catch(() => (userProfile = null));
		}
	}

	// Fetch recommendated animes and mangas
	let animes: AnimeInfo[];
	let mangas: MangaInfo[];

	const myRecommendations = getMyRecommendations();
	let isMyRecommendations = username.toLowerCase() === $user?.username.toLocaleLowerCase();
	$: isMyRecommendations = username.toLowerCase() === $user?.username.toLocaleLowerCase();

	if (!isMyRecommendations) {
		getRecommendations(username).then((result) => {
			animes = result.animes;
			mangas = result.mangas;
		});
	}

	const unsubscribe = myRecommendations.subscribe(async (recommendations) => {
		if (recommendations && isMyRecommendations) {
			[animes, mangas] = await Promise.all([
				getAnimes([...recommendations.animes]),
				getMangas([...recommendations.mangas]),
			]);
		}
	});

	onDestroy(unsubscribe);
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{displayUsername}'s recommendations - Animendation</title>
</svelte:head>

<div class="bg-gradient-to-t from-primary-800 to-primary-900 w-full">
	<div class="flex gap-4 container items-end pb-3">
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
			{:else if userProfile === undefined && showSpinner}
				<Spinner />
			{:else if userProfile === null}
				<NoProfilePicture />
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
			<h2 class="text-primary-50 text-xl font-medium">{displayUsername}</h2>
		</div>
	</div>
</div>

<div class="container">
	<Tabs contentClass="bg-transparent mt-4" style="underline">
		<TabItem open title="Animes">
			<Recommendations
				type="Anime"
				series={animes}
				{username}
				myRecommendations={isMyRecommendations}
			/>
		</TabItem>
		<TabItem title="Mangas">
			<Recommendations
				type="Manga"
				series={mangas}
				{username}
				myRecommendations={isMyRecommendations}
			/>
		</TabItem>
		<TabItem title="Friends" />
	</Tabs>
</div>

{#if scrollY > 300}
	<div transition:fade={{ duration: 150 }} class="fixed bottom-5 right-5">
		<Button
			class="rounded-full aspect-square p-3"
			on:click={() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}><ChevronUpIcon class="h-8 -translate-y-0.5" /></Button
		>
		<Tooltip class="whitespace-nowrap">Go to top</Tooltip>
	</div>
{/if}
