<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import LoginLink from '$lib/components/LoginLink.svelte';
	import ProfileDropdown from '$lib/components/dropdowns/ProfileDropdown.svelte';
	import GithubRepoLink from '$lib/components/links/GithubRepoLink.svelte';
	import Logo from '$lib/components/logos/Logo.svelte';
	import UserSearch from '$lib/components/searchs/UserSearch.svelte';
	import { getUserProfile } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';
	import { Button } from 'flowbite-svelte';

	let pictureUrl: string | undefined | null;

	$: $user &&
		getUserProfile($user.username).then(
			(user) => (pictureUrl = user?.images?.webp?.image_url ?? null)
		);
</script>

<div class="min-h-screen">
	<nav class="bg-primary-900 py-3">
		<div class="container flex justify-between items-center">
			<a href={$user ? `/home` : '/'}>
				<Logo class="text-[26px]" />
			</a>
			<div class="flex gap-3">
				<div class="hidden sm:flex items-center">
					<GithubRepoLink />
				</div>
				<UserSearch class="p-2.5" />
				{#if $user}
					<ProfileDropdown {pictureUrl} profileUrl="/profile/{$user.username}" />
				{:else}
					<LoginLink><Button class="font-semibold py-2.5">Login</Button></LoginLink>
				{/if}
			</div>
		</div>
	</nav>

	<slot />
</div>

<Footer />
