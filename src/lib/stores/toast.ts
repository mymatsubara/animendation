import { writable } from 'svelte/store';

export type ToastLevel = 'success' | 'error' | 'warning' | 'neutral';
export type ToastMessage = {
	message: string;
	level?: ToastLevel;
};

export const toast = writable<ToastMessage | undefined>();
