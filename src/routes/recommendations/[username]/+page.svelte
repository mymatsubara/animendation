<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { UsersService } from '$lib/clients/jikan/generated';
	import EditRecommendations from '$lib/components/EditRecommendations.svelte';
	import RecommendationList from '$lib/components/RecommendationList.svelte';
	import { user } from '$lib/stores/user';

	$: username = $page.params.username;
	$: userPromise = browser ? UsersService.getUserProfile(username) : undefined;

	let edit = false;
</script>

<h1>{username}</h1>

{#if userPromise}
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
{/if}

{#if username.toLocaleLowerCase() === $user?.username?.toLocaleLowerCase()}
	<button on:click={() => (edit = !edit)}>{edit ? 'My recommendations' : 'Edit'}</button>
{/if}

{#if !edit}
	<RecommendationList {username} />
{:else if $user?.username}
	<EditRecommendations username={$user.username} />
{/if}
