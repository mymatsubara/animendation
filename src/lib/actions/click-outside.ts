export function clickOutside(element: HTMLElement, handler: (e: MouseEvent) => void) {
	const clickHandler = (e: MouseEvent) => {
		if (e.target && !e.defaultPrevented && !element.contains(e.target as Node)) {
			handler(e);
		}
	};
	document.addEventListener('click', clickHandler, true);

	return {
		destroy() {
			document.removeEventListener('click', clickHandler, true);
		}
	};
}
