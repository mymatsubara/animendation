import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type FeedType = 'anime' | 'manga';
const localStorageKey = 'animendation-feed-type';

const store = writable<FeedType>(getFeedType());

function getFeedType() {
	if (browser) {
		const type = window.localStorage.getItem(localStorageKey);
		return type === 'manga' ? 'manga' : 'anime';
	}

	return 'anime';
}

function setFeedType(type: FeedType) {
	window.localStorage.setItem(localStorageKey, type);
}

export function feedType() {
	return {
		subscribe: store.subscribe,
		set: (type: FeedType) => {
			store.set(type);
			setFeedType(type);
		},
	};
}
