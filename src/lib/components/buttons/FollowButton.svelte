<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc/client';
	import { Button, Spinner } from 'flowbite-svelte';
	import type { ButtonProps } from 'flowbite-svelte/dist/buttons/Button.svelte';
	import { twMerge } from 'tailwind-merge';

	export let username: string;
	export let size: ButtonProps['size'] = 'xs';

	let loading = false;
	let imFollowing: boolean | undefined = undefined;

	$: if ($user) {
		trpc.user.amIFollowing.query({ username }).then((result) => (imFollowing = result));
	}

	async function toggleFollow() {
		try {
			loading = true;
			await trpc.user.toggleFollow.mutate({
				username,
			});
			imFollowing = !imFollowing;
		} catch {
			$toast = {
				level: 'error',
				message: imFollowing
					? 'Error while unfollowing. Try again.'
					: 'Error while following. Try again.',
			};
		} finally {
			loading = false;
		}
	}
</script>

{#if $user && imFollowing !== undefined && $user.username.toLowerCase() !== username.toLowerCase()}
	<Button
		{size}
		class={twMerge(
			`relative ${
				imFollowing ? 'bg-primary-800 text-primary-200' : 'bg-primary-700 text-primary-100'
			}`,
			$$restProps.class
		)}
		on:click={toggleFollow}
		disabled={loading}
	>
		{#if loading}
			<div class="absolute"><Spinner color="primary" size="4" /></div>
		{/if}
		{imFollowing ? 'Unfollow' : 'Follow'}</Button
	>
{/if}
