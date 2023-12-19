<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import LoginLink from '$lib/components/LoginLink.svelte';
	import ProfileDropdown from '$lib/components/dropdowns/ProfileDropdown.svelte';
	import GithubRepoLink from '$lib/components/links/GithubRepoLink.svelte';
	import Logo from '$lib/components/logos/Logo.svelte';
	import UserSearch from '$lib/components/searchs/UserSearch.svelte';
	import { getProfilePicture } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';
	import { Button } from 'flowbite-svelte';

	const profilePicture = getProfilePicture();
</script>

<div class="min-h-screen">
	<nav class="bg-primary-900 py-3">
		<div class="container flex justify-between items-center">
			<a href={$user ? `/profile/${$user.username}` : '/'}>
				<Logo class="text-[26px]" />
			</a>
			<div class="flex">
				<div class="hidden sm:flex items-center mr-3">
					<GithubRepoLink />
				</div>
				<UserSearch class="p-2.5" />
				{#if $user}
					<div class="mr-2">
						<ProfileDropdown
							profilePicture={$profilePicture}
							recommendationsUrl="/profile/{$user.username}"
						/>
					</div>
				{:else}
					<LoginLink><Button class="font-semibold py-2.5">Login</Button></LoginLink>
				{/if}
			</div>
		</div>
	</nav>

	<slot />
</div>

<Footer />
