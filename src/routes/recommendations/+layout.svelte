<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { UsersService } from '$lib/clients/jikan/generated';
	import { user } from '$lib/stores/user';

	const username = browser ? $page.url.searchParams.get('username') ?? $user?.username : undefined;

	if (browser && !username) {
		goto('/');
	}

	// Fetch user profile picture from jikan api
	const userPromise = username ? UsersService.getUserProfile(username) : null;
</script>

{#if username}
	<h1>{username}</h1>

	{#await userPromise}
		Loading..
	{:then user}
		{#if user?.data?.images?.webp?.image_url}
			<img src={user.data.images.webp.image_url} alt="{username}'s profile picture" />
		{:else}
			Not profile picture
		{/if}
	{:catch}
		500 unexpected error
	{/await}

	<slot />
{/if}
