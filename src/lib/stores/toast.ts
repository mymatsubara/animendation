import { writable } from 'svelte/store';

export type ToastMessage = {
	message: string;
	level?: 'success' | 'error' | 'warning' | 'neutral';
};

export const toast = writable<ToastMessage | undefined>();
