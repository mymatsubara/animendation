<script lang="ts">
	import { page } from '$app/stores';
	import RecommendationsPage from '$lib/components/recommendations/RecommendationsPage.svelte';
</script>

{#key $page.params.username}
	<RecommendationsPage username={$page.params.username} />
{/key}
