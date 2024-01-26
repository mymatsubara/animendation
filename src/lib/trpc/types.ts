export type PaginatedData<T, Token = number> = {
	data: T[];
	hasNextPage: boolean;
	nextPageToken: Token;
};
