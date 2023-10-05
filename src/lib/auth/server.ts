import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { AuthUser } from '$lib/auth/types';
import type { Cookies } from '@sveltejs/kit';
import jwt, { type JwtSignOptions } from '@tsndr/cloudflare-worker-jwt';
import type { JwtPayload } from 'jsonwebtoken';

export module Auth {
	export function signBackendAccessToken(
		user: AuthUser,
		options?: JwtSignOptions & { expiresIn?: number }
	) {
		const exp =
			options?.expiresIn !== undefined
				? Math.floor(Date.now() / 1000) + options.expiresIn
				: undefined;

		return jwt.sign({ ...user, exp }, env.BACKEND_ACCESS_TOKEN_SECRET, options);
	}

	export function verifyBackendAccessToken(token: string) {
		return jwt.verify(token, env.BACKEND_ACCESS_TOKEN_SECRET);
	}

	export function decodeBackendAccessToken(token: string) {
		return jwt.decode(token).payload as AuthUser & JwtPayload;
	}
}

export module AuthCookies {
	export const MAL_REFRESH_TOKEN_COOKIE = 'mr';
	export const BACKEND_ACCESS_TOKEN_COOKIE = 'be';

	export function setCookies(cookies: Cookies, accessToken: string, refreshToken: string) {
		setCookie(cookies, BACKEND_ACCESS_TOKEN_COOKIE, accessToken);
		setCookie(cookies, MAL_REFRESH_TOKEN_COOKIE, refreshToken);
	}

	export function getCookies(cookies: Cookies) {
		const accessToken = cookies.get(BACKEND_ACCESS_TOKEN_COOKIE);
		const refreshToken = cookies.get(MAL_REFRESH_TOKEN_COOKIE);

		return {
			accessToken,
			refreshToken
		};
	}

	function setCookie(cookies: Cookies, name: string, value: string) {
		cookies.set(name, value, {
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			path: '/'
		});
	}
}
