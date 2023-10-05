import { router } from '$lib/trpc';
import { auth } from '$lib/trpc/routes/auth';
import { recommendation } from '$lib/trpc/routes/recommendation';
import { user } from '$lib/trpc/routes/user';

export const appRouter = router({
	user,
	recommendation,
	auth
});

export type AppRouter = typeof appRouter;
