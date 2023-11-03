import { dev } from '$app/environment';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';

export const t = initTRPC.context<Context>().create({
	errorFormatter: ({ shape, error }) => {
		return error.code !== 'INTERNAL_SERVER_ERROR'
			? shape
			: {
					...shape,
					message: dev ? shape.message : "Unexpected server error. Soon we'll be investigating it."
			  };
	}
});

export const router = t.router;
export const publicProcedure = t.procedure;
