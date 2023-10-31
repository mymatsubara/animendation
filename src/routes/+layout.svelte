<script lang="ts">
	import { toast, type ToastLevel } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc/client';
	import { Toast } from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		ExclamationCircleSolid,
		InfoCircleSolid
	} from 'flowbite-svelte-icons';
	import type { ToastProps } from 'flowbite-svelte/dist/toast/Toast.svelte';
	import { onMount } from 'svelte';
	import '../app.postcss';

	onMount(async () => {
		try {
			const u = await trpc.user.me.query();
			$user = u;
		} catch {
			$user = null;
		}
	});

	const toastColor: Record<ToastLevel, ToastProps['color']> = {
		error: 'red',
		neutral: 'gray',
		success: 'green',
		warning: 'yellow'
	};
</script>

<slot />

{#if $toast}
	<Toast
		class="fixed bottom-4 left-1/2 -translate-x-1/2"
		color={toastColor[$toast.level ?? 'success']}
		on:close={() => ($toast = undefined)}
	>
		<svelte:fragment slot="icon">
			{#if $toast.level === 'success'}
				<CheckCircleSolid class="w-5 h-5" />
			{:else if $toast.level === 'error'}
				<CloseCircleSolid class="w-5 h-5" />
			{:else if $toast.level === 'warning'}
				<ExclamationCircleSolid class="w-5 h-5" />
			{:else if $toast.level === 'neutral'}
				<InfoCircleSolid class="w-5 h-5" />
			{:else}
				<CheckCircleSolid class="w-5 h-5" />
			{/if}
		</svelte:fragment>
		{$toast.message}
	</Toast>
{/if}
