import type { AuthUser } from '$lib/auth/types';
import type { MALOauth } from '$lib/clients/myanimelist/oauth';

export type PostBody = Pick<MALOauth.GetTokenConfig, 'authCode' | 'codeVerifier'>;
export type PostResponse = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	token_type: string;
	backend_access_token: string;
	user: AuthUser;
};
