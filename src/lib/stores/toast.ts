import { writable } from 'svelte/store';

export type ToastLevel = 'success' | 'error' | 'warning' | 'neutral';
export type ToastMessage = {
	message: string;
	level?: ToastLevel;
};
type StoreData = ToastMessage | undefined;

const store = writable<StoreData>();

export const toast = {
	subscribe: store.subscribe,
	set: (data: StoreData) => {
		store.set(undefined);
		setTimeout(() => store.set(data), 100);
	},
	update: store.update,
};
