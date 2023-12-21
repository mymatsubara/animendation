<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';

	$: if ($user === null) {
		goto('/');
	}
</script>

<slot />
