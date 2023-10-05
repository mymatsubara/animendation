import { publicProcedure } from '$lib/trpc';
import { isAuth } from '$lib/trpc/middlewares/auth';

export const authProcedure = publicProcedure.use(isAuth);
