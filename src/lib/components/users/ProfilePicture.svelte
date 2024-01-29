<script context="module" lang="ts">
	import type { AvatarProps } from 'flowbite-svelte/dist/avatar/Avatar.svelte';

	type Size = Exclude<AvatarProps['size'], undefined>;
	const sizeMap = {
		xs: 'w-6',
		sm: 'w-8',
		md: 'w-10',
		lg: 'w-20',
		xl: 'w-36',
		none: 'w-10',
	} satisfies Record<Size, string>;
</script>

<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import { twMerge } from 'tailwind-merge';

	export let pictureUrl: string | undefined;
	export let size: Size = 'sm';
</script>

{#if pictureUrl}
	<!-- svelte-ignore a11y-img-redundant-alt -->
	<div class={sizeMap[size]}>
		<img
			class={twMerge(
				sizeMap[size] ?? size,
				'object-top object-cover rounded-full aspect-square ring-1 ring-gray-300',
				$$restProps.class
			)}
			src={pictureUrl}
			alt="My profile picture"
		/>
	</div>
{:else}
	<Avatar class={twMerge('ring-1 ring-gray-300', $$restProps.class)} {size} />
{/if}
