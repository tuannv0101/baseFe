export type PageParams = {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
};

// Common backend shapes for paginated lists.
export type SpringPage<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

export type SimplePage<T> = {
  items: T[];
  total?: number;
  page?: number;
  size?: number;
};

export type PageResponse<T> = SpringPage<T> | SimplePage<T> | unknown;

