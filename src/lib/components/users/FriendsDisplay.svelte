<script lang="ts">
	import { UsersService, type user_friends, type user_meta } from '$lib/clients/jikan/generated';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import ArrowTopRightIcon from '$lib/components/icons/ArrowTopRightIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import { Card } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	type Friend = {
		user?: user_meta;
	} & {
		last_online?: string;
		friends_since?: string;
	};

	export let username: string;

	let loading = true;
	let page = 1;

	let pageData: user_friends;
	let friends: Friend[];

	loadMoreFriends();

	function loadMoreFriends() {
		UsersService.getUserFriends(username, page).then((result) => {
			pageData = result;
			friends = (friends ?? []).concat(pageData.data ?? []);
			loading = false;
			page++;
		});
	}

	function setupInfiniteScroll(e: HTMLElement) {
		let observer = new IntersectionObserver(
			() => {
				if (!loading && pageData.pagination?.has_next_page) {
					loadMoreFriends();
				}
			},
			{
				threshold: 0.1,
				rootMargin: '150px',
			}
		);
		observer.observe(e);

		return {
			destroy() {
				observer.disconnect();
			},
		};
	}
</script>

<div>
	<h1 class="text-xl tracking-tight font-medium pt-1 pb-2">Friends</h1>

	<div class="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 pb-4">
		{#if friends !== undefined}
			{#each friends as friend (friend?.user?.username)}
				{@const href = `/profile/${friend?.user?.username}`}

				<Card padding="sm">
					<div class="flex flex-col justify-center items-center">
						<a class="min-w-[4rem] w-16" {href}>
							<img
								class="w-full aspect-square object-top object-cover rounded-full border"
								src={friend.user?.images?.webp?.image_url}
								alt="{friend.user?.username}'s profile picture"
							/>
						</a>
						<a
							class="w-full text-center mt-1 whitespace-nowrap overflow-hidden overflow-ellipsis font-medium text-gray-700 hover:text-gray-900"
							{href}>{friend?.user?.username}</a
						>
						<a
							class="flex gap-1 items-center py-1 text-primary-600 hover:text-primary-700"
							href="https://myanimelist.net/profile/{friend?.user?.username}"
							target="_blank"
							><MyanimelistLogoIcon class="h-3" /><ArrowTopRightIcon class="h-3 mb-[3px]" /></a
						>
					</div>
				</Card>
			{/each}
		{/if}

		{#if loading}
			{#each new Array(25).fill(0) as _}
				<div class="p-4">
					<Placeholder class="rounded h-[115px] w-full" />
				</div>
			{/each}
		{/if}

		<span use:setupInfiniteScroll />
	</div>

	{#if friends?.length === 0}
		<div in:fade={{ duration: 150 }} class="flex flex-col items-center justify-center gap-2">
			<div class="font-bold text-3xl">(╥_╥)</div>
			<div class="text-gray-600">No friends added</div>
		</div>
	{/if}
</div>
