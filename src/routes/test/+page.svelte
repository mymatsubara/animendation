<script lang="ts">
	import Autocomplete from '$lib/components/forms/Autocomplete.svelte';

	let value: string;
</script>

<div class="h-16" />
<Autocomplete
	bind:value
	placeholder="Genre"
	options={new Array(100).fill(0).map((_, i) => ({ value: `Genre ${i}` }))}
/>

<div>Value: <span>{value}</span></div>

<select>
	<option>Test1</option>
	<option>Test2</option>
	<option>Test3</option>
	<option>Test4</option>
	<option>Test5</option>
</select>
<div class="h-[1000px]" />
