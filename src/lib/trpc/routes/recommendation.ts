import { publicProcedure, router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';

export const recommendation = router({
	list: publicProcedure.query(() => {
		return { message: 'hello world' };
	}),

	mine: authProcedure.query(({ input, ctx }) => {
		return ctx.user;
	})
});
