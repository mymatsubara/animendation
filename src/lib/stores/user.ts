import type { AuthUser } from '$lib/auth';
import { writable } from 'svelte/store';

export const user = writable<AuthUser | undefined | null>();
