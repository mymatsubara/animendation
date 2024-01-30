<script context="module" lang="ts">
	type Size = 'md' | 'lg';

	const textSize: Record<Size, string> = {
		md: 'text-base',
		lg: 'text-xl',
	};

	const gap: Record<Size, string> = {
		md: 'gap-3',
		lg: 'gap-4',
	};
</script>

<script lang="ts">
	import ProfilePicture from '$lib/components/users/ProfilePicture.svelte';
	import { getUserProfile } from '$lib/stores/profile-picture';
	import { twMerge } from 'tailwind-merge';

	export let size: Size = 'md';
	export let username: string;
	export let contentClass: string | undefined = undefined;
	let pictureUrl: string | undefined | null;

	$: getUserProfile(username).then((user) => {
		username = user?.username ?? username;
		pictureUrl = user?.images?.webp?.image_url ?? null;
	});

	$: profileUrl = `/profile/${username}`;
</script>

<div class={twMerge(`flex items-start ${gap[size]}`, $$restProps.class)}>
	<a title="{username}'s profile" href={profileUrl}><ProfilePicture {pictureUrl} {size} /></a>
	<div class={twMerge('w-full', contentClass)}>
		<div class="flex">
			<a class="font-semibold {textSize[size]}" title="{username}'s profile" href={profileUrl}
				>{username}</a
			>
			<slot name="side-signature" />
		</div>

		<slot />
	</div>
</div>
