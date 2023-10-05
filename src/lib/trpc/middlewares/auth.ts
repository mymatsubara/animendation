import { env } from '$env/dynamic/private';
import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import { Auth, AuthCookies } from '$lib/auth/server';
import { MALClient } from '$lib/clients/myanimelist';
import { MALOauth } from '$lib/clients/myanimelist/oauth';
import { t } from '$lib/trpc';
import { JwtUtils } from '$lib/utils/jwt';
import { TRPCError } from '@trpc/server';

export const isAuth = t.middleware(async ({ ctx, next }) => {
	const tokens = AuthCookies.getCookies(ctx.event.cookies);

	// Verify access tokens
	if (
		!tokens.backend.accessToken ||
		!tokens.mal.accessToken ||
		!(await Auth.verifyBackendAccessToken(tokens.backend.accessToken))
	) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	// Try to refreh MAL access token
	if (JwtUtils.isExpired(tokens.mal.accessToken)) {
		const refreshToken = tokens.mal.refreshToken;
		if (!refreshToken) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		const malTokens = await MALOauth.refreshTokens({
			clientId: PUBLIC_MAL_CLIENT_ID,
			clientSecret: env.MAL_CLIENT_SECRET,
			refreshToken
		});

		if (!malTokens) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		const cookies = ctx.event.cookies;
		AuthCookies.setCookies({
			mal: {
				accessToken: malTokens.access_token,
				refreshToken: malTokens.refresh_token
			},
			backend: {
				accessToken: tokens.backend.accessToken
			},
			cookies
		});

		tokens.mal = {
			accessToken: malTokens.access_token,
			refreshToken: malTokens.refresh_token
		};
	}

	const malClient = new MALClient(tokens.mal.accessToken as string);

	return next({
		ctx: {
			user: await Auth.decodeBackendAccessToken(tokens.backend.accessToken),
			malClient
		}
	});
});
