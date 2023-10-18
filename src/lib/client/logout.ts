import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';

export async function logout() {
	await trpc.auth.logout.mutate();
	user.set(undefined);
}
