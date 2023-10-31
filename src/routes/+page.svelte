<script lang="ts">
	import { goto } from '$app/navigation';
	import LoginLink from '$lib/components/LoginLink.svelte';
	import { user } from '$lib/stores/user';

	$: {
		if ($user) {
			const username = $user.username;
			goto(`/recommendations/${username}`);
		}
	}
</script>

<LoginLink>Login</LoginLink>
