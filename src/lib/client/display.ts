import type { AnimeStatus, MangaStatus } from '$lib/clients/myanimelist';
import type { BadgeProps } from 'flowbite-svelte/dist/badge/Badge.svelte';

export type StatusDisplay = {
	label: string;
	color: BadgeProps['color'];
};

export const animeStatusDisplay: Record<AnimeStatus, StatusDisplay> = {
	completed: {
		label: 'Completed',
		color: 'blue',
	},
	watching: {
		label: 'Watching',
		color: 'green',
	},
	plan_to_watch: {
		label: 'Plan to watch',
		color: 'dark',
	},
	dropped: {
		label: 'Dropped',
		color: 'red',
	},
	on_hold: {
		label: 'On hold',
		color: 'yellow',
	},
} as const;

export const mangaStatusDisplay: Record<MangaStatus, StatusDisplay> = {
	completed: {
		label: 'Completed',
		color: 'blue',
	},
	reading: {
		label: 'Reading',
		color: 'green',
	},
	plan_to_read: {
		label: 'Plan to read',
		color: 'dark',
	},
	dropped: {
		label: 'Dropped',
		color: 'red',
	},
	on_hold: {
		label: 'On hold',
		color: 'yellow',
	},
} as const;
