import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// ?limit=3&skip=0&sort=email
export const Pagination = createParamDecorator(
  (data, ctx: ExecutionContext): PaginationParams => {
    const req: Request = ctx.switchToHttp().getRequest();

    const paginationParams: PaginationParams = {
      skip: 0,
      limit: 10,
      sort: [],
    };

    paginationParams.skip = req.query.skip
      ? parseInt(req.query.skip.toString())
      : 0;
    paginationParams.limit = req.query.limit
      ? parseInt(req.query.limit.toString())
      : 10;

    // create array of sort
    if (req.query.sort) {
      const sortArray = req.query.sort.toString().split(',');
      paginationParams.sort = sortArray.map((sortItem) => {
        const sortBy = sortItem[0];
        switch (sortBy) {
          case '-':
            return {
              field: sortItem.slice(1),
              by: 'DESC',
            };
          case '+':
            return {
              field: sortItem.slice(1),
              by: 'ASC',
            };
          default:
            return {
              field: sortItem.trim(),
              by: 'ASC',
            };
        }
      });
    }

    return paginationParams;
  },
);

export interface PaginationParams {
  skip?: number;
  limit?: number;
  sort?: { field: string; by: 'ASC' | 'DESC' }[];
}
