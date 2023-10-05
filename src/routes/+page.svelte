<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
	import { MALOauth } from '$lib/clients/myanimelist/oauth';
	import { user } from '$lib/stores/user';

	const oauth = MALOauth.getAuthUrl(PUBLIC_MAL_CLIENT_ID);

	$: {
		if ($user) {
			goto(`/recommendations`);
		}
	}
</script>

<a
	href={oauth.url}
	on:click={() => {
		MALOauth.persistState({
			codeVerifier: oauth.codeVerifier,
			state: oauth.state
		});
	}}>Login</a
>
