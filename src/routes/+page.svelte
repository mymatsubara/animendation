<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>In progress</h1>

<pre>{JSON.stringify(data.animes, null, 4)}</pre>

<style>
	pre {
		white-space: pre;
	}
</style>
