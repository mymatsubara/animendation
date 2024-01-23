<script>
	import { Button, Tooltip } from 'flowbite-svelte';

	import { fade } from 'svelte/transition';
	import ChevronUpIcon from '../icons/ChevronUpIcon.svelte';
</script>

<div transition:fade={{ duration: 150 }} class="fixed bottom-5 right-5">
	<Button
		class="rounded-full aspect-square p-3"
		on:click={() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}}><ChevronUpIcon class="h-8 -translate-y-0.5" /></Button
	>
	<Tooltip class="whitespace-nowrap">Go to top</Tooltip>
</div>
