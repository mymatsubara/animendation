<script lang="ts">
	import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
	import { MALOauth } from '$lib/clients/myanimelist/oauth';

	const oauth = MALOauth.getAuthUrl(PUBLIC_MAL_CLIENT_ID);
</script>

<a
	href={oauth.url}
	on:click={() => {
		MALOauth.persistState({
			codeVerifier: oauth.codeVerifier,
			state: oauth.state
		});
	}}><slot /></a
>
