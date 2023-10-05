<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<pre class="whitespace-pre-wrap">{JSON.stringify(data.people, null, 4)}</pre>
