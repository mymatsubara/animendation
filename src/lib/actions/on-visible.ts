type Input = {
	callback: () => void;
	options?: IntersectionObserverInit;
};

export function onVisible(e: HTMLElement, { callback, options }: Input) {
	let observer = new IntersectionObserver(callback, options);
	observer.observe(e);

	return {
		destroy() {
			observer.disconnect();
		},
	};
}
