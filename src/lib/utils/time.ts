const hourInSecs = 60 * 60;

export function formatTimeElapsed(date: Date) {
	const now = Date.now();
	const diffSecs = Math.ceil(Math.max(now - date.getTime(), 0) / 1000);

	if (diffSecs < 60) {
		return `${diffSecs}s`;
	} else if (diffSecs < hourInSecs) {
		return `${Math.floor(diffSecs / 60)}m`;
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

export function formatPostDate(date: Date) {
	return date.toLocaleTimeString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
}

export function isCurrentYear(date: Date) {
	return new Date().getUTCFullYear() === date.getUTCFullYear();
}
