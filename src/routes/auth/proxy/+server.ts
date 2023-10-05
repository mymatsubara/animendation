import { env } from '$env/dynamic/private';
import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { Auth, AuthCookies } from '$lib/auth/server';
import { MALClient } from '$lib/clients/myanimelist';
import { MALOauth } from '$lib/clients/myanimelist/oauth';
import type { RequestHandler } from '@sveltejs/kit';
import type { PostBody } from '../types';

export const POST: RequestHandler = async (event) => {
	const body: PostBody = await event.request.json();

	if (!body?.authCode || !body?.codeVerifier) {
		return new Response('invalid body', { status: 400 });
	}

	const tokens = await MALOauth.getTokens({
		clientId: PUBLIC_MAL_CLIENT_ID,
		clientSecret: env.MAL_CLIENT_SECRET,
		...body
	});

	if (!tokens) {
		return new Response('unexpected error', { status: 401 });
	}

	const client = new MALClient(tokens.access_token);
	const me = await client.getMe();

	const userId = me.id;
	const username = me.name;
	if (!userId || !username) {
		return new Response('unexpected error', { status: 401 });
	}

	const user = {
		userId,
		username
	};
	const backendAccessToken = Auth.signBackendAccessToken(user);

	const cookies = event.cookies;
	AuthCookies.setRefreshTokenCookie(cookies, tokens.refresh_token);
	AuthCookies.setBackendAccessTokenCookie(cookies, backendAccessToken);

	return new Response(
		JSON.stringify({ ...tokens, backend_access_token: backendAccessToken, user })
	);
};
