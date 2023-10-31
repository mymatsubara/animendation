/// Instructions from: https://myanimelist.net/apiconfig/references/authorization
export module MALOauth {
	const OAUTH_URL = 'https://myanimelist.net/v1/oauth2';
	const STATE_KEY = 'state';
	export const ACCESS_TOKEN_KEY = 't';

	export type AuthUrlResult = {
		codeVerifier: string;
		codeChallenge: string;
		state: string;
		url: string;
	};

	export type GetTokensInput = {
		clientId: string;
		clientSecret: string;
		authCode: string;
		codeVerifier: string;
	};

	export type RefrehTokensInput = {
		clientId: string;
		clientSecret: string;
		refreshToken: string;
	};

	export type TokensResponse = {
		token_type: string;
		expires_in: number;
		access_token: string;
		refresh_token: string;
	};

	type State = {
		state: string;
		codeVerifier: string;
	};

	export function getAuthUrl(clientId: string): AuthUrlResult {
		const codeVerifier = createCodeVerifier();
		const codeChallenge = createCodeChallenge(codeVerifier);
		const state = crypto?.randomUUID?.() ?? Math.random().toString();

		const queryParams = new URLSearchParams({
			response_type: 'code',
			client_id: clientId,
			code_challenge: codeChallenge,
			code_challenge_method: 'plain',
			state
		});

		const url = `${OAUTH_URL}/authorize?${queryParams}`;

		return {
			codeVerifier,
			codeChallenge,
			state,
			url
		};
	}

	export async function getTokens(input: GetTokensInput): Promise<TokensResponse | null> {
		const response = await fetch(`${OAUTH_URL}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: input.clientId,
				client_secret: input.clientSecret,
				grant_type: 'authorization_code',
				code: input.authCode,
				code_verifier: input.codeVerifier
			})
		});

		if (response.status >= 400) {
			return null;
		}

		return response.json();
	}

	export async function refreshTokens(input: RefrehTokensInput): Promise<TokensResponse | null> {
		const response = await fetch(`${OAUTH_URL}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: input.refreshToken,
				client_id: input.clientId,
				client_secret: input.clientSecret
			})
		});

		if (response.status >= 400) {
			return null;
		}

		return response.json();
	}

	export function persistState(state: State) {
		window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
	}

	export function getState(): State | null {
		const state = window.localStorage.getItem(STATE_KEY);

		return state ? JSON.parse(state) : state;
	}

	// https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
	function createCodeVerifier() {
		return `${crypto?.randomUUID?.()}-${crypto?.randomUUID?.()}`;
	}

	// https://datatracker.ietf.org/doc/html/rfc7636#section-4.2 (plain)
	function createCodeChallenge(codeVerifier: string) {
		return codeVerifier;
	}
}
