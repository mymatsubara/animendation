import { env } from '$env/dynamic/private';
import { PUBLIC_MAL_CLIENT_ID } from '$env/static/public';
import type { AuthUser } from '$lib/auth';
import { Auth, AuthCookies } from '$lib/auth';
import { MALClient } from '$lib/clients/myanimelist';
import { MALOauth } from '$lib/clients/myanimelist/oauth';
import { publicProcedure, router } from '$lib/trpc';
import { upsertUser } from '$lib/trpc/routes/user';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const authRoute = router({
	login: publicProcedure
		.input(
			z.object({
				authCode: z.string().min(1),
				codeVerifier: z.string().min(1),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const malTokens = await MALOauth.getTokens({
				clientId: PUBLIC_MAL_CLIENT_ID,
				clientSecret: env.MAL_CLIENT_SECRET,
				...input,
			});

			if (!malTokens) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const client = new MALClient({ accessToken: malTokens.access_token });
			const malUser = await upsertUser(client);

			const user: AuthUser = {
				userId: malUser.id,
				username: malUser.name,
				picture: malUser.picture ?? null,
			};
			const backendAccessToken = await Auth.signBackendAccessToken(user);

			AuthCookies.setCookies({
				cookies: ctx.event.cookies,
				mal: {
					accessToken: malTokens.access_token,
					refreshToken: malTokens.refresh_token,
				},
				backend: {
					accessToken: backendAccessToken,
				},
			});

			return user;
		}),
	logout: publicProcedure.mutation(({ ctx }) => {
		AuthCookies.deleteCookies(ctx.event.cookies);
	}),
});
