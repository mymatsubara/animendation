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

	export type GetTokenConfig = {
		clientId: string;
		clientSecret: string;
		authCode: string;
		codeVerifier: string;
	};

	export type GetTokenResponse = {
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
		const state = crypto.randomUUID();

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

	export async function getTokens(config: GetTokenConfig): Promise<GetTokenResponse | null> {
		const response = await fetch(`${OAUTH_URL}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: config.clientId,
				client_secret: config.clientSecret,
				grant_type: 'authorization_code',
				code: config.authCode,
				code_verifier: config.codeVerifier
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
		return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
	}

	// https://datatracker.ietf.org/doc/html/rfc7636#section-4.2 (plain)
	function createCodeChallenge(codeVerifier: string) {
		return codeVerifier;
	}
}
