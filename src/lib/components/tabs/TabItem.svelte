<script lang="ts" generics="T">
	export let name: T;
	export let group: T;
</script>

<label class="relative font-medium text-primary-300 px-5 pb-2 pt-3 m-0 cursor-pointer">
	{name}
	<input class="absolute inset-0 opacity-0" type="radio" value={name} bind:group />
</label>

<style lang="postcss">
	label:has(input:checked) {
		@apply text-primary-50 border-b-2 border-primary-50;
	}

	label:has(input:focus) {
		@apply ring-2;
	}
</style>
