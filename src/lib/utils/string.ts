export function capitalize(s: string) {
	return s
		.split(' ')
		.map((word) => titleCase(word))
		.join(' ');
}

export function titleCase(s: string) {
	return s[0].toUpperCase() + s.substring(1).toLowerCase();
}
