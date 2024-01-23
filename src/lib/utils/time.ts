const hourInSecs = 60 * 60;

export function formatPostDate(date: Date) {
	const now = Date.now();
	const diffSecs = Math.ceil(Math.max(now - date.getTime(), 0) / 1000);

	if (diffSecs < 60) {
		return `${diffSecs}s`;
	} else if (diffSecs < 24 * hourInSecs) {
		return `${Math.floor(diffSecs / hourInSecs)}h`;
	} else {
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: isCurrentYear(date) ? 'numeric' : undefined,
		});
	}
}

export function isCurrentYear(date: Date) {
	return new Date().getUTCFullYear() === date.getUTCFullYear();
}
