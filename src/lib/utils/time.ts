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
			year: isCurrentYear(date) ? undefined : 'numeric',
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

const msConversionRate = {
	milliseconds: 1,
	seconds: 1000,
	minutes: 60000,
	hours: 3.6e6,
	days: 8.64e7,
	weeks: 6.048e8,
	months: 2.628e9,
	years: 3.154e10,
} as const;

type TimeUnit = keyof typeof msConversionRate;

export function convertTime(value: number, from: TimeUnit, to: TimeUnit) {
	return value * msConversionRate[from] * (1 / msConversionRate[to]);
}
