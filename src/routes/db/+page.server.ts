import { db } from '$lib/server/db';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	await db
		.insertInto('Person')
		.values({ firstName: 'Jennifer', gender: 'female' })
		.returning('id')
		.executeTakeFirstOrThrow();

	const people = await db.selectFrom('Person').selectAll().execute();

	return { people };
};
