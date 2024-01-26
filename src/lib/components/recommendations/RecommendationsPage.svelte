<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getAnimes } from '$lib/client/animes';
	import { getMangas } from '$lib/client/mangas';
	import { getRecommendations } from '$lib/client/recommendations';
	import NoProfilePicture from '$lib/components/NoProfilePicture.svelte';
	import FollowButton from '$lib/components/buttons/FollowButton.svelte';
	import GoToTopButton from '$lib/components/buttons/GoToTopButton.svelte';
	import ArrowTopRightIcon from '$lib/components/icons/ArrowTopRightIcon.svelte';
	import CameraIcon from '$lib/components/icons/CameraIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import Recommendations from '$lib/components/recommendations/Recommendations.svelte';
	import Tabs from '$lib/components/tabs/Tabs.svelte';
	import FollowersDisplay from '$lib/components/users/FollowersDisplay.svelte';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import { getUserProfile, type UserProfile } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc/client';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { MangaInfo } from '$lib/trpc/routes/manga';
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let username: string;

	type TabName = typeof tabs[number];
	const pictureClass = 'w-[100px] aspect-square flex items-center justify-center';
	const allTabs = ['Animes', 'Mangas', 'Followers', 'Following'] as const;
	const tabs = [allTabs[0], allTabs[1]] as const;

	let userProfile: UserProfile | null | undefined = undefined;
	let scrollY: number;
	let showSpinner = false;
	const tabSearchParam = $page.url.searchParams.get('tab');
	let tab = allTabs.includes(tabSearchParam as any) ? tabSearchParam : (tabs[0] as TabName);
	let edit = !!$user && !!$page.url.searchParams.get('edit');

	setTimeout(() => (showSpinner = true), 300);

	$: isMe = $user?.username?.toLowerCase() === username.toLocaleLowerCase();
	$: displayUsername = userProfile?.username ?? username;
	$: {
		if (username && browser) {
			getUserProfile(username)
				.then((result) => (userProfile = result ?? null))
				.catch(() => (userProfile = null));
		}
	}

	// Refresh profile in the server when the profile picture changes
	$: {
		const profilePicture = userProfile?.images?.webp?.image_url;
		if ($user && profilePicture && isMe && $user.picture !== profilePicture) {
			console.log({ picture: $user.picture, profilePicture });
			trpc.user.refreshMyProfile.mutate();
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

	// Tab
	function tabChanged(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target?.value) {
			return;
		}

		updateTabQueryParam(target.value);
	}

	function updateTabQueryParam(tab: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set('tab', tab);

		goto(`?${query.toString()}`);
	}

	function usernameTextSize(displayUsername: string) {
		const length = displayUsername.length;
		if (length > 17) {
			return 'text-sm';
		} else if (length > 14) {
			return 'text-base';
		} else if (length > 10) {
			return 'text-lg';
		} else {
			return 'text-xl';
		}
	}
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{displayUsername}'s profile - Animendation</title>
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
				aria-label="Myanimelist profile link"
				><MyanimelistLogoIcon class="h-3" /><ArrowTopRightIcon class="h-3 mb-[3px]" /></a
			>
			<h2 class="text-primary-100 {usernameTextSize(displayUsername)} sm:text-xl font-semibold">
				{displayUsername}
			</h2>
			<div class="mt-1 flex gap-3 text-sm text-primary-200">
				<button
					class="hover:underline"
					on:click={() => {
						tab = 'Following';
						updateTabQueryParam(tab);
					}}
					><span class="font-medium text-primary-100">{userProfile?.followingCount ?? ' '}</span> following</button
				>
				<button
					class="hover:underline"
					on:click={() => {
						tab = 'Followers';
						updateTabQueryParam(tab);
					}}
					><span class="font-medium text-primary-100">{userProfile?.followersCount ?? ' '}</span> followers</button
				>
			</div>
		</div>
		<div>
			<FollowButton {username} />
		</div>
	</div>

	<div class="container">
		<Tabs {tabs} bind:selected={tab} on:change={tabChanged} />
	</div>
</div>

<div class="container mt-4">
	{#if tab === 'Animes'}
		<Recommendations
			type="Anime"
			series={animes}
			{username}
			myRecommendations={isMyRecommendations}
			{edit}
		/>
	{:else if tab === 'Mangas'}
		<Recommendations
			type="Manga"
			series={mangas}
			{username}
			myRecommendations={isMyRecommendations}
			{edit}
		/>
	{:else if tab === 'Following'}
		<FollowersDisplay type="following" {username} />
	{:else if tab === 'Followers'}
		<FollowersDisplay type="followers" {username} />
	{/if}
</div>

{#if scrollY > 300}
	<GoToTopButton />
{/if}
