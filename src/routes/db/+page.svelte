<script lang="ts">
	import { trpc } from '$lib/trpc/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const result = trpc.recommendation.list.query();
	const authed = trpc.recommendation.mine.query();
</script>

<!-- <pre class="whitespace-pre-wrap">{JSON.stringify(data.people, null, 4)}</pre> -->

{#await result}
	<h2>Loading...</h2>
{:then r}
	<pre class="whitespace-pre-wrap">{JSON.stringify(r, null, 4)}</pre>
{:catch e}
	<div class="text-red-500">{e}</div>
{/await}

{#await authed}
	<h2>Loading...</h2>
{:then user}
	<pre class="whitespace-pre-wrap">{JSON.stringify(user, null, 4)}</pre>
{:catch e}
	<div class="text-red-500">{e}</div>
{/await}
