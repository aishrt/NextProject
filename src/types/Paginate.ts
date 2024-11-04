export type PaginateData<Entry> = {
    data: Entry[];
    currentPage: number;
    totalEntries: number;
}

export type PaginateClient = {
    page?: number
}