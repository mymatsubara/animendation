<script lang="ts">
	import { logout } from '$lib/client/logout';
	import { Avatar, Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	export let profilePicture: string | undefined;
</script>

<div>
	<Button class="border-0 w-max p-0 rounded-full">
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
	</Button>
	<Dropdown placement="bottom-start">
		<DropdownItem on:click={logout}>Log out</DropdownItem>
	</Dropdown>
</div>
