<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getAnimes } from '$lib/client/animes';
	import { getMangas } from '$lib/client/mangas';
	import { getRecommendations } from '$lib/client/recommendations';
	import type { user_profile } from '$lib/clients/jikan/generated';
	import NoProfilePicture from '$lib/components/NoProfilePicture.svelte';
	import FollowButton from '$lib/components/buttons/FollowButton.svelte';
	import ArrowTopRightIcon from '$lib/components/icons/ArrowTopRightIcon.svelte';
	import CameraIcon from '$lib/components/icons/CameraIcon.svelte';
	import ChevronUpIcon from '$lib/components/icons/ChevronUpIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import Recommendations from '$lib/components/recommendations/Recommendations.svelte';
	import Tabs from '$lib/components/tabs/Tabs.svelte';
	import FriendsDisplay from '$lib/components/users/FriendsDisplay.svelte';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';
	import { getUserProfile } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';
	import type { AnimeInfo } from '$lib/trpc/routes/anime';
	import type { MangaInfo } from '$lib/trpc/routes/manga';
	import { Button, Spinner, Tooltip } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let username: string;

	type TabName = typeof tabs[number];
	const pictureClass = 'w-[100px] aspect-square flex items-center justify-center';
	const tabs = ['Animes', 'Mangas', 'Friends'] as const;

	let userProfile: user_profile | null | undefined = undefined;
	let scrollY: number;
	let showSpinner = false;
	const tabSearchParam = $page.url.searchParams.get('tab');
	let tab = tabs.includes(tabSearchParam as any) ? tabSearchParam : (tabs[0] as TabName);

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

		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set('tab', target.value);

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
			<h2 class="text-primary-100 {usernameTextSize(displayUsername)} sm:text-xl font-medium">
				{displayUsername}
			</h2>
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
		/>
	{:else if tab === 'Mangas'}
		<Recommendations
			type="Manga"
			series={mangas}
			{username}
			myRecommendations={isMyRecommendations}
		/>
	{:else if tab === 'Friends'}
		<FriendsDisplay {username} />
	{/if}
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
