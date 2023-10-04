import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// OpenAPI.HEADERS = {
	// 	'X-MAL-CLIENT-ID': env.MAL_CLIENT_ID ?? ''
	// };

	// const animes = await MalClient.getUserAnimeList('XDmuriloXD', {
	// 	fields: 'list_status',
	// 	sort: 'list_updated_at'
	// });

	return { animes: {} };
};
