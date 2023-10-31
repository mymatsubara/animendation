<script lang="ts">
	import { logout } from '$lib/client/logout';
	import { Avatar, Dropdown, DropdownItem } from 'flowbite-svelte';

	export let profilePicture: string | undefined;
</script>

<div>
	<button>
		{#if profilePicture}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				class="h-8 object-top object-cover rounded-full aspect-square"
				src={profilePicture}
				alt="My profile picture"
			/>
		{:else}
			<Avatar size="sm" />
		{/if}
	</button>
	<Dropdown>
		<DropdownItem on:click={logout}>Logout</DropdownItem>
	</Dropdown>
</div>
