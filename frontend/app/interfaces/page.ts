export interface Page {
  count: number;
  limit: number;
  page: number;
}

export interface Paginated<T> extends Page {
  items: T[];
}
