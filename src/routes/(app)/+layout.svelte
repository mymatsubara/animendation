<script lang="ts">
	import LoginLink from '$lib/components/LoginLink.svelte';
	import ProfileDropdown from '$lib/components/dropdown/ProfileDropdown.svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import { getProfilePicture } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';
	import { Button } from 'flowbite-svelte';

	const profilePicture = getProfilePicture();
</script>

<nav class="bg-primary-900 py-4">
	<div class="container flex justify-between items-center">
		<Logo class="text-[28px]" />
		<div>
			{#if $user}
				<ProfileDropdown
					profilePicture={$profilePicture}
					recommendationsUrl="/recommendations/{$user.username}"
				/>
			{:else}
				<LoginLink><Button class="font-semibold py-1.5">Login</Button></LoginLink>
			{/if}
		</div>
	</div>
</nav>
<slot />
