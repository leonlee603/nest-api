import { PaginationQueryDto } from './dto/pagination-query.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export function buildPaginationResult<T>(
  items: T[],
  total: number,
  { page = 1, limit = 10 }: PaginationQueryDto,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data: items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
  };
}
