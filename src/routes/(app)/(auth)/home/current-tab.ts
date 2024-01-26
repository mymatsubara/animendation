import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const homeTabs = ['Animes', 'Mangas', 'Suggestions'] as const;
type Tab = typeof homeTabs[number];

const localStorageKey = 'animendation-home-tab';

const store = writable<Tab>(getCurrentTab());

function getCurrentTab() {
	if (browser) {
		const tab = window.localStorage.getItem(localStorageKey);
		return tab as Tab;
	}

	return homeTabs[0];
}

function setCurrentTab(tab: Tab) {
	window.localStorage.setItem(localStorageKey, tab);
}

export function currentHomeTab() {
	return {
		subscribe: store.subscribe,
		set: (tab: Tab) => {
			store.set(tab);
			setCurrentTab(tab);
		},
	};
}
