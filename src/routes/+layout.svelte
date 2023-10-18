<script>
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import '../app.postcss';

	onMount(async () => {
		try {
			const u = await trpc.user.me.query();
			console.log({ u });
			$user = u;
		} catch {
			$user = null;
		}
	});
</script>

<slot />
