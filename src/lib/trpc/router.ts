import { router } from '$lib/trpc';
import { recommendation } from '$lib/trpc/routes/recommendation';

export const appRouter = router({
	recommendation
});

export type AppRouter = typeof appRouter;
