import { router } from '$lib/trpc';
import { authRoute } from '$lib/trpc/routes/auth';
import { recommendationRoute } from '$lib/trpc/routes/recommendation';
import { userRoute } from '$lib/trpc/routes/user';

export const appRouter = router({
	user: userRoute,
	recommendation: recommendationRoute,
	auth: authRoute
});

export type AppRouter = typeof appRouter;
