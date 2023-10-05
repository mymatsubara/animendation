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
	type SetCookiesInput = {
		cookies: Cookies;
		mal: {
			accessToken: string;
			refreshToken: string;
		};
		backend: {
			accessToken: string;
		};
	};

	const MAL_REFRESH_TOKEN_COOKIE = 'mr';
	const MAL_ACCESS_TOKEN_COOKIE = 'ma';
	const BACKEND_ACCESS_TOKEN_COOKIE = 'ba';

	export function setCookies(input: SetCookiesInput) {
		const cookies = input.cookies;

		setCookie(cookies, BACKEND_ACCESS_TOKEN_COOKIE, input.backend.accessToken);
		setCookie(cookies, MAL_REFRESH_TOKEN_COOKIE, input.mal.refreshToken);
		setCookie(cookies, MAL_ACCESS_TOKEN_COOKIE, input.mal.accessToken);
	}

	export function getCookies(cookies: Cookies) {
		const backendAccessToken = cookies.get(BACKEND_ACCESS_TOKEN_COOKIE);
		const malRefreshToken = cookies.get(MAL_REFRESH_TOKEN_COOKIE);
		const malAccessToken = cookies.get(MAL_ACCESS_TOKEN_COOKIE);

		return {
			mal: {
				accessToken: malAccessToken,
				refreshToken: malRefreshToken
			},
			backend: {
				accessToken: backendAccessToken
			}
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
