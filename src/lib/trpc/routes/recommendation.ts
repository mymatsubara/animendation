import { publicProcedure, router } from '$lib/trpc';

export const recommendation = router({
	list: publicProcedure.query(() => {
		return { message: 'hello world' };
	})
});
