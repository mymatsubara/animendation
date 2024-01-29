<script lang="ts">
	import { Button } from 'flowbite-svelte';

	import { titleCase } from '$lib/utils/string';
	import UserSignature from '../users/UserSignature.svelte';

	export let type: 'anime' | 'manga';
	export let username: string;
</script>

<UserSignature contentClass="w-full" size="lg" {username}>
	<Button
		class="mt-2"
		size="sm"
		href="/profile/{username}?tab={type === 'anime' ? 'Animes' : 'Mangas'}&edit=true"
		>Recommend {titleCase(type)}</Button
	>
</UserSignature>
