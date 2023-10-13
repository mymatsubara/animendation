import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await db
		.insertInto('Genre')
		.values({
			id: Math.ceil(Math.random() * 100000),
			name: 'Madness'
		})
		.execute();

	const genres = await db.selectFrom('Genre').selectAll().execute();

	return { genres };
};
