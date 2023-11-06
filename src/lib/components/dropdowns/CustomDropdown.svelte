<script lang="ts">
	import { clickOutside } from '$lib/actions/click-outside';
	import { twMerge } from 'tailwind-merge';

	export let open = false;
	let buttonDiv: HTMLElement;

	const notypecheck = (e: any) => e as any;
	function toggle() {
		open = !open;
	}
</script>

<div class="relative w-max">
	<div bind:this={buttonDiv}>
		<slot name="button" {toggle} />
	</div>

	{#if open}
		<div
			class={twMerge(
				'absolute translate-y-full right-0 -bottom-2 rounded-lg shadow-lg z-10 divide-y bg-white',
				$$restProps.class
			)}
			use:clickOutside={(e) => {
				if (!buttonDiv.contains(notypecheck(e.target))) {
					open = false;
				}
			}}
		>
			{#if $$slots.header}
				<div class="py-1 overflow-hidden rounded-t-lg">
					<slot name="header" {toggle} />
				</div>
			{/if}

			<div class="py-1">
				<slot {toggle} />
			</div>

			{#if $$slots.footer}
				<div class="py-1 overflow-hidden rounded-t-lg">
					<slot name="footer" {toggle} />
				</div>
			{/if}
		</div>
	{/if}
</div>
