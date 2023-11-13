import { toast } from '$lib/stores/toast';
import type { AppRouter } from '$lib/trpc/router';
import type { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';

export const showErrorToUser: TRPCLink<AppRouter> = () => {
	return ({ next, op }) => {
		return observable((observer) => {
			const unsubscribe = next(op).subscribe({
				next(value) {
					observer.next(value);
				},
				error(err) {
					if (err.data?.code === 'INTERNAL_SERVER_ERROR') {
						toast.set({
							message: 'Maybe the Myanimelist servers are down. Try again later',
							level: 'error',
						});
					}
					observer.error(err);
				},
				complete() {
					observer.complete();
				},
			});

			return unsubscribe;
		});
	};
};
