import { router } from '$lib/trpc';
import { animeRoute } from '$lib/trpc/routes/anime';
import { animelistRouter } from '$lib/trpc/routes/animelist';
import { authRoute } from '$lib/trpc/routes/auth';
import { mangaRoute } from '$lib/trpc/routes/manga';
import { mangaListRouter } from '$lib/trpc/routes/mangalist';
import { recommendationRoute } from '$lib/trpc/routes/recommendation';
import { userRoute } from '$lib/trpc/routes/user';

export const appRouter = router({
	user: userRoute,
	recommendation: recommendationRoute,
	auth: authRoute,
	anime: animeRoute,
	manga: mangaRoute,
	animelist: animelistRouter,
	mangalist: mangaListRouter,
});

export type AppRouter = typeof appRouter;
