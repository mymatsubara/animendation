<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { MALOauth } from '$lib/clients/myanimelist/oauth';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc/client';
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		const params = $page.url.searchParams;
		const code = params.get('code');
		const state = params.get('state');

		const expectedState = MALOauth.getState();

		function failAuth(e?: any) {
			console.error('Error on authentication');
			console.error(e);
			$toast = { message: 'Unexpected error. Please try again.', level: 'error' };
			goto('/');
		}

		console.log({ code, state });

		if (state !== expectedState?.state || !code) {
			failAuth();
		} else {
			try {
				const authUser = await trpc.auth.login.mutate({
					authCode: code,
					codeVerifier: expectedState.codeVerifier,
				});
				console.log(authUser);

				$user = authUser;

				goto('/home');
			} catch (e) {
				failAuth(e);
			}
		}
	});
</script>

<div class="h-[70%] flex flex-col justify-center items-center gap-2">
	<Spinner />
	<div class="text-gray-700 text-sm font-medium">Logging in...</div>
</div>
