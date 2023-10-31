<script lang="ts">
	import LoginButton from '$lib/components/LoginButton.svelte';
	import ProfileDropdown from '$lib/components/dropdown/ProfileDropdown.svelte';
	import { getProfilePicture } from '$lib/stores/profile-picture';
	import { user } from '$lib/stores/user';

	const profilePicture = getProfilePicture();
</script>

<div class="bg-primary-700 pt-3">
	<div class="container flex justify-between">
		<div />
		<div>
			{#if $user}
				<ProfileDropdown
					profilePicture={$profilePicture}
					recommendationsUrl="/recommendations/{$user.username}"
				/>
			{:else}
				<LoginButton>Login</LoginButton>
			{/if}
		</div>
	</div>
</div>
<slot />
