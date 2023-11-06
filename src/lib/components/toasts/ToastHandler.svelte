<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import Toast from './Toast.svelte';

	let timeout: NodeJS.Timeout | undefined;
	const autohideTime = 5000;

	$: {
		if ($toast) {
			timeout && clearTimeout(timeout);
			setTimeout(() => {
				$toast = undefined;
				timeout = undefined;
			}, autohideTime);
		}
	}
</script>

{#if $toast}
	<Toast
		content={$toast}
		on:close={() => {
			$toast = undefined;
		}}
	/>
{/if}
