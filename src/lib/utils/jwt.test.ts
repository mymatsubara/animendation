import { Auth } from '$lib/auth/server';
import type { AuthUser } from '$lib/auth/types';
import { JwtUtils } from '$lib/utils/jwt';
import { describe, expect, it } from 'vitest';

describe('JwtUtils', () => {
	it('should check if expired correctly', async () => {
		const user: AuthUser = {
			userId: 1,
			username: 'test'
		};

		const expired = await Auth.signBackendAccessToken(user, {
			expiresIn: -1000
		});
		expect(JwtUtils.isExpired(expired)).toBe(true);

		const notExpired = await Auth.signBackendAccessToken(user, {
			expiresIn: 100000
		});
		expect(JwtUtils.isExpired(notExpired)).toBe(false);

		const withoutExp = await Auth.signBackendAccessToken(user);
		expect(JwtUtils.isExpired(withoutExp)).toBe(false);
	});
});
