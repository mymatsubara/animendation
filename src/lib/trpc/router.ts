import { router } from '$lib/trpc';
import { animeRoute } from '$lib/trpc/routes/anime';
import { authRoute } from '$lib/trpc/routes/auth';
import { recommendationRoute } from '$lib/trpc/routes/recommendation';
import { userRoute } from '$lib/trpc/routes/user';

export const appRouter = router({
	user: userRoute,
	recommendation: recommendationRoute,
	auth: authRoute,
	anime: animeRoute
});

export type AppRouter = typeof appRouter;
