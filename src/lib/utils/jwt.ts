import { decode } from '@tsndr/cloudflare-worker-jwt';

export module JwtUtils {
	export function isExpired(token: string) {
		const { payload } = decode(token);

		if (payload?.exp === undefined) {
			return false;
		}

		return Date.now() > payload.exp * 1000;
	}
}
