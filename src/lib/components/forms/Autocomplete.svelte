<script lang="ts">
	import {
		autoUpdate,
		computePosition,
		flip,
		offset,
		type ReferenceElement
	} from '@floating-ui/dom';
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	type Option = { value: string; label?: string };

	export let options: Option[];
	export let value: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	let selectedOption: Option | undefined;
	let inputText: string | undefined = value;
	let input: HTMLElement;
	let tooltip: HTMLElement;

	$: filteredOptions = inputText
		? options.filter((option) =>
				JSON.stringify(option)
					.toLowerCase()
					.includes((inputText as string).toLowerCase())
		  )
		: options;

	function updatePosition() {
		computePosition(input as ReferenceElement, tooltip, {
			placement: 'top',
			middleware: [offset(4), flip()]
		}).then(({ x, y }) => {
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	let cleanup: () => void;

	function showTooltip() {
		tooltip.style.display = 'block';
		cleanup = autoUpdate(input, tooltip, updatePosition);
	}

	function hideTooltip() {
		tooltip.style.display = 'none';
		cleanup?.();
	}

	function label(option: Option) {
		return option.label ?? option.value;
	}

	function select(option: Option) {
		selectedOption = option;
		value = option.value;
		inputText = label(option);
	}

	const notypescheck = (x: any) => x;
</script>

<div class="relative w-full">
	<input
		class={twMerge('p-2 w-full rounded-lg border border-gray-300', $$restProps.class)}
		type="search"
		{placeholder}
		on:focus={showTooltip}
		on:focusout={hideTooltip}
		on:keydown={(e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				// inputText = selectedOption ? label(selectedOption) : '';
				input.blur();
			}

			if (e.key === 'Enter' && filteredOptions.length) {
				const hoveredOption = document.querySelectorAll(':hover[data-index]');
				const index = Number(notypescheck(hoveredOption[0])?.dataset?.index ?? 0);

				select(filteredOptions[index]);
				hideTooltip();
				input.blur();
			}
		}}
		bind:this={input}
		bind:value={inputText}
	/>

	<div
		class="absolute w-full hidden max-h-72 bg-white p-3 rounded-lg text-sm border border-gray-300 h-max overflow-y-scroll"
		bind:this={tooltip}
	>
		<div class="flex flex-col">
			{#each filteredOptions as option, i (option.value)}
				<option
					data-index={i}
					transition:slide={{ duration: 150 }}
					class="text-left hover:bg-gray-100 p-2 rounded-lg font-medium"
					on:mousedown={() => {
						console.log('clicked');
						select(option);
					}}
				>
					{label(option)}
				</option>
			{/each}
		</div>
	</div>
</div>
