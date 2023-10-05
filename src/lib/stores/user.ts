import type { AuthUser } from '$lib/auth/types';
import { writable } from 'svelte/store';

export const user = writable<AuthUser | undefined>();
