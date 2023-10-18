<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
	import { MALOauth } from '$lib/clients/myanimelist/oauth';
	import LoginButton from '$lib/components/LoginButton.svelte';
	import { user } from '$lib/stores/user';

	const oauth = MALOauth.getAuthUrl(PUBLIC_MAL_CLIENT_ID);

	$: {
		if ($user) {
			const username = $user.username;
			goto(`/recommendations/${username}`);
		}
	}
</script>

<LoginButton>Login</LoginButton>
