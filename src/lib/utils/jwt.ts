import decode from 'jwt-decode';

export module JwtUtils {
	export function isExpired(token: string) {
		const content = decode<{ exp?: number }>(token);

		if (content.exp === undefined) {
			return false;
		}

		return Date.now() > content.exp * 1000;
	}
}
