import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { AuthUser } from '$lib/auth/types';
import type { Cookies } from '@sveltejs/kit';
import jwt, { type JwtSignOptions } from '@tsndr/cloudflare-worker-jwt';

export module Auth {
	export function signBackendAccessToken(user: AuthUser, options?: JwtSignOptions) {
		return jwt.sign(user, env.BACKEND_ACCESS_TOKEN_SECRET, options);
	}

	export function verifyBackendAccessToken(token: string) {
		return jwt.verify(token, env.BACKEND_ACCESS_TOKEN_SECRET);
	}
}

export module AuthCookies {
	const MAL_REFRESH_TOKEN_COOKIE = 'mr';
	const BACKEND_ACCESS_TOKEN_COOKIE = 'be';

	export function setBackendAccessTokenCookie(cookies: Cookies, accessToken: string) {
		setCookie(cookies, BACKEND_ACCESS_TOKEN_COOKIE, accessToken);
	}

	export function setRefreshTokenCookie(cookies: Cookies, refreshToken: string) {
		setCookie(cookies, MAL_REFRESH_TOKEN_COOKIE, refreshToken);
	}

	function setCookie(cookies: Cookies, name: string, value: string) {
		cookies.set(name, value, {
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax'
		});
	}
}
