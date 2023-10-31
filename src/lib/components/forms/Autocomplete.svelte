<script lang="ts">
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import {
		autoUpdate,
		computePosition,
		flip,
		offset,
		type ReferenceElement
	} from '@floating-ui/dom';
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	type V = $$Generic;
	type T = $$Generic<Option<V>>;
	type Option = { value: V; label?: string };

	export let options: Option[];
	export let value: V | undefined = undefined;

	let selectedOption: Option | undefined;
	let inputText: string | undefined = value?.toString();
	let input: HTMLElement;
	let tooltip: HTMLElement;
	let cleanup: () => void;
	let focusedIndex = 0;
	let componentId = `multiselect-${Math.random()}`;
	let open = false;

	$: filteredOptions = inputText
		? options.filter((option) =>
				JSON.stringify(option)
					.toLowerCase()
					.includes((inputText as string).toLowerCase())
		  )
		: options;

	function updatePosition() {
		computePosition(input as ReferenceElement, tooltip, {
			placement: 'bottom',
			middleware: [offset(4), flip()]
		}).then(({ x, y }) => {
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	let keyboard: 'open' | 'closed' = 'closed';
	function virtualKeyboardHandler(event: any) {
		const clientHeight = document.scrollingElement?.clientHeight;
		const viewportHeight = event.target?.height;

		let prevKeyboard = keyboard;
		keyboard =
			clientHeight && viewportHeight && Math.abs(clientHeight - viewportHeight) > 30
				? 'open'
				: 'closed';

		if (prevKeyboard === 'open' && keyboard === 'closed') {
			hideTooltip();
		} else if (prevKeyboard === 'closed' && keyboard === 'open') {
			showTooltip();
		}
	}

	function showTooltip() {
		tooltip.style.display = 'block';
		cleanup = autoUpdate(input, tooltip, updatePosition);
		open = true;

		if ('visualViewport' in window && 'virtualKeyboard' in navigator) {
			(window.visualViewport as any).addEventListener('resize', virtualKeyboardHandler);
		}
	}

	function hideTooltip() {
		tooltip.style.display = 'none';
		cleanup?.();
		open = false;

		// Clear when inputText does not match the option
		if (!selectedOption || label(selectedOption) !== inputText) {
			select(undefined);
		}

		if ('visualViewport' in window && 'virtualKeyboard' in navigator) {
			(window.visualViewport as any).removeEventListener('resize', virtualKeyboardHandler);
		}
	}

	function label(option: Option) {
		return option.label ?? option.value?.toString();
	}

	function select(option?: Option) {
		selectedOption = option;
		value = option?.value;
		inputText = option ? label(option) : undefined;
		focusedIndex = 0;
	}

	const notypescheck = (x: any) => x;

	onDestroy(() => {
		cleanup?.();
	});

	function scrollTo(optionIndex: number) {
		const focusedElement = document.getElementById(optionId(optionIndex));

		if (focusedElement && tooltip) {
			const offset = 200;
			tooltip.scrollTop = Math.max(notypescheck(focusedElement).offsetTop - offset, 0);
		}
	}

	function optionId(optionIndex: number) {
		return `${componentId}-${optionIndex}`;
	}
</script>

<div class="relative w-full">
	<input
		{...$$restProps}
		class={twMerge(
			'px-4 py-2.5 w-full rounded-lg border border-gray-300 text-sm font-medium',
			$$restProps.class
		)}
		type="search"
		on:input={() => {
			focusedIndex = 0;
			tooltip.scrollTop = 0;
		}}
		on:focus={showTooltip}
		on:focusout={hideTooltip}
		on:keydown={(e) => {
			if (e.key === 'Escape') {
				e.preventDefault();

				if (inputText) {
					select(undefined);
					tooltip.scrollTop = 0;
				} else {
					input.blur();
				}
			} else if (e.key === 'Enter' && filteredOptions.length) {
				select(filteredOptions[focusedIndex]);
				hideTooltip();
				input.blur();
			} else if (e.key === 'Enter' && filteredOptions.length === 0) {
				select(undefined);
				hideTooltip();
				input.blur();
			} else if (e.key === 'ArrowDown') {
				focusedIndex = Math.min(focusedIndex + 1, filteredOptions.length - 1);
				scrollTo(focusedIndex);
			} else if (e.key === 'ArrowUp') {
				focusedIndex = Math.max(focusedIndex - 1, 0);
				scrollTo(focusedIndex);
			}
		}}
		bind:this={input}
		bind:value={inputText}
	/>

	<ChevronDownIcon
		stroke-width="3.5"
		class="absolute p-1 right-3 top-1/2 -translate-y-1/2 h-6 transition cursor-pointer {open
			? 'rotate-180'
			: 'pointer-events-none'}"
	/>

	<div
		class="z-10 absolute w-full hidden max-h-72 bg-white p-3 rounded-lg text-sm border border-gray-300 h-max overflow-y-auto"
		bind:this={tooltip}
	>
		<div class="flex flex-col">
			{#each filteredOptions as option, i (option.value)}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					id={optionId(i)}
					transition:slide={{ duration: 150 }}
					class="text-left p-2 rounded-lg font-medium {focusedIndex === i ? 'bg-gray-100' : ''}"
					on:mousedown={() => {
						select(option);
					}}
					on:mouseenter={() => {
						focusedIndex = i;
					}}
				>
					{label(option)}
				</div>
			{/each}
			{#if filteredOptions.length === 0}
				<div class="text-left p-2 rounded-lg font-medium text-gray-500">No results</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	input[type='search']::-webkit-search-cancel-button {
		@apply right-5;
	}
</style>
