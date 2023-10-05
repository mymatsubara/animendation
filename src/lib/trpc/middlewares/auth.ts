import { Auth, AuthCookies } from '$lib/auth/server';
import { t } from '$lib/trpc';
import { TRPCError } from '@trpc/server';

export const isAuth = t.middleware(async ({ ctx, next }) => {
	const { accessToken } = AuthCookies.getCookies(ctx.event.cookies);

	if (!accessToken || !(await Auth.verifyBackendAccessToken(accessToken))) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({
		ctx: {
			user: await Auth.decodeBackendAccessToken(accessToken)
		}
	});
});
