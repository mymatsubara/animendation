import { publicProcedure, router } from '$lib/trpc';

export const recommendationRoute = router({
	list: publicProcedure.query(() => {
		return { message: 'hello world' };
	})
});
