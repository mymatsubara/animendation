<script lang="ts">
	import { logout } from '$lib/client/logout';
	import HomeIcon from '$lib/components/icons/HomeIcon.svelte';
	import LeaveIcon from '$lib/components/icons/LeaveIcon.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import ProfilePicture from '$lib/components/users/ProfilePicture.svelte';
	import { Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte';

	export let pictureUrl: string | undefined | null;
	export let profileUrl: string;
</script>

<div class="h-8">
	<button class="border-0 p-1 w-max rounded-full bg-transparent group">
		<ProfilePicture size="sm" class="group-focus:ring-primary-700" {pictureUrl} />
	</button>
	<Dropdown class="py-2" placement="bottom-start">
		<DropdownItem class="flex gap-3" href="/home"><HomeIcon class="h-5" />Home</DropdownItem>
		<DropdownItem class="flex gap-3" href={profileUrl}><UserIcon class="h-5" />Profile</DropdownItem
		>
		<DropdownDivider />
		<DropdownItem class="flex gap-3 text-red-500" on:click={logout}
			><LeaveIcon class="h-5" />Log out</DropdownItem
		>
	</Dropdown>
</div>
