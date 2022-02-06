import { Pagination } from './pagination';

export interface PaginatedList<T> {
  data?: T[];
  pagination?: Pagination;
}
