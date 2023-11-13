<script lang="ts">
	import LoginLink from '$lib/components/LoginLink.svelte';
	import ProfileDropdown from '$lib/components/dropdowns/ProfileDropdown.svelte';
	import Logo from '$lib/components/logos/Logo.svelte';
	import UserSearch from '$lib/components/searchs/UserSearch.svelte';
	import { getProfilePicture } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';
	import { Button } from 'flowbite-svelte';

	const profilePicture = getProfilePicture();
</script>

<nav class="bg-primary-900 py-3">
	<div class="container flex justify-between items-center">
		<a href={$user ? `/profile/${$user.username}` : '/'}>
			<Logo class="text-[26px]" />
		</a>
		<div class="flex gap-2">
			<UserSearch class="p-2.5" />
			{#if $user}
				<ProfileDropdown
					profilePicture={$profilePicture}
					recommendationsUrl="/profile/{$user.username}"
				/>
			{:else}
				<LoginLink><Button class="font-semibold py-2.5">Login</Button></LoginLink>
			{/if}
		</div>
	</div>
</nav>
<slot />
