<script lang="ts">
	import { Button } from 'flowbite-svelte';

	import { titleCase } from '$lib/utils/string';
	import UserSignature from '../users/UserSignature.svelte';

	export let type: 'anime' | 'manga';
	export let username: string;
</script>

<UserSignature contentClass="w-full" size="lg" {username}>
	<Button outline class="mt-2 bg-primary-800 text-primary-50 hover:bg-primary-900" size="sm"
		>Recommend {titleCase(type)}</Button
	>
</UserSignature>
