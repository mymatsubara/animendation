<script lang="ts">
	import { logout } from '$lib/client/logout';
	import LeaveIcon from '$lib/components/icons/LeaveIcon.svelte';
	import { Avatar, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte';

	export let profilePicture: string | undefined;
	export let recommendationsUrl: string;
</script>

<div class="h-8">
	<button class="border-0 p-1 w-max rounded-full bg-transparent group">
		{#if profilePicture}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				class="h-8 object-top object-cover rounded-full aspect-square border border-primary-700 group-focus:ring-2"
				src={profilePicture}
				alt="My profile picture"
			/>
		{:else}
			<Avatar border size="sm" />
		{/if}
	</button>
	<Dropdown class="py-2" placement="bottom-start">
		<DropdownItem href={recommendationsUrl}>My recommendations</DropdownItem>
		<DropdownDivider />
		<DropdownItem class="flex gap-2 text-red-500" on:click={logout}
			><LeaveIcon class="h-5" /> Log out</DropdownItem
		>
	</Dropdown>
</div>
