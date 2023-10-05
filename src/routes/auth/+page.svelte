<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { MALOauth } from '$lib/clients/myanimelist/oauth';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import type { PostBody, PostResponse } from './types';

	onMount(async () => {
		const params = $page.url.searchParams;
		const code = params.get('code');
		const state = params.get('state');

		const expectedState = MALOauth.getState();

		function failAuth() {
			$toast = { message: 'Unexpected error. Please try again.', level: 'error' };
			goto('/');
		}

		if (state !== expectedState?.state || !code) {
			failAuth();
		} else {
			const response = await fetch('/auth/proxy', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({
					authCode: code,
					codeVerifier: expectedState.codeVerifier
				} satisfies PostBody)
			});

			if (response.status >= 400) {
				failAuth();
			}

			const resp = (await response.json()) as PostResponse;
			$user = {
				accessToken: resp.access_token,
				data: resp.user
			};

			goto('/');
		}
	});
</script>

<h1>Loading...</h1>
