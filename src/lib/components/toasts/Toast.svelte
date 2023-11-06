<script lang="ts">
	import type { ToastLevel, ToastMessage } from '$lib/stores/toast';
	import { Toast } from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		ExclamationCircleSolid,
		InfoCircleSolid
	} from 'flowbite-svelte-icons';
	import type { ToastProps } from 'flowbite-svelte/dist/toast/Toast.svelte';
	import { slide } from 'svelte/transition';

	export let content: ToastMessage;

	const toastColor: Record<ToastLevel, ToastProps['color']> = {
		error: 'red',
		neutral: 'gray',
		success: 'green',
		warning: 'yellow'
	};
</script>

<div class="fixed bottom-0 left-0">
	<div class="p-3" transition:slide={{ duration: 250 }}>
		<Toast class="max-w-md p-3" color={toastColor[content.level ?? 'success']} on:close>
			<svelte:fragment slot="icon">
				{#if content.level === 'success'}
					<CheckCircleSolid class="w-5 h-5" />
				{:else if content.level === 'error'}
					<CloseCircleSolid class="w-5 h-5" />
				{:else if content.level === 'warning'}
					<ExclamationCircleSolid class="w-5 h-5" />
				{:else if content.level === 'neutral'}
					<InfoCircleSolid class="w-5 h-5" />
				{:else}
					<CheckCircleSolid class="w-5 h-5" />
				{/if}
			</svelte:fragment>
			{content.message}
		</Toast>
	</div>
</div>
