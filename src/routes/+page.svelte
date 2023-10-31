<script lang="ts">
	import { goto } from '$app/navigation';
	import LoginButton from '$lib/components/LoginButton.svelte';
	import { user } from '$lib/stores/user';

	$: {
		if ($user) {
			const username = $user.username;
			goto(`/recommendations/${username}`);
		}
	}
</script>

<LoginButton>Login</LoginButton>
