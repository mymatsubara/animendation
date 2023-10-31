<script lang="ts">
	import { logout } from '$lib/client/logout';
	import LeaveIcon from '$lib/components/icons/LeaveIcon.svelte';
	import { Avatar, Button, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte';

	export let profilePicture: string | undefined;
	export let recommendationsUrl: string;
</script>

<div>
	<Button class="border-0 w-max p-0 rounded-full">
		{#if profilePicture}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				class="h-8 object-top object-cover rounded-full aspect-square border border-primary-50"
				src={profilePicture}
				alt="My profile picture"
			/>
		{:else}
			<Avatar border size="sm" />
		{/if}
	</Button>
	<Dropdown class="py-2" placement="bottom-start">
		<DropdownItem href={recommendationsUrl}>My recommendations</DropdownItem>
		<DropdownDivider />
		<DropdownItem class="flex gap-2 text-red-500" on:click={logout}
			><LeaveIcon class="h-5" /> Log out</DropdownItem
		>
	</Dropdown>
</div>
