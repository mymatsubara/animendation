import type { AuthUser } from '$lib/auth';
import { router } from '$lib/trpc';
import { authProcedure } from '$lib/trpc/procedures';

export const userRoute = router({
	me: authProcedure.query(({ ctx }) => {
		return ctx.user as AuthUser;
	})
});
