import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// ?filter=something&search=email:something@mail.com,name:keyword,
export const Search = createParamDecorator(
  (data, ctx: ExecutionContext): SearchParams => {
    const req: Request = ctx.switchToHttp().getRequest();

    const searchParams: SearchParams = {
      search: [],
      filter: '',
    };

    if (req.query.filter) {
      searchParams.filter = req.query.filter.toString();
    }

    // create array of search
    if (req.query.search) {
      const searchArray = req.query.search.toString().split(',');
      searchParams.search = searchArray.map((searchItem) => {
        const field = searchItem.split(':')[0];
        const value = searchItem.split(':')[1];
        return {
          field,
          value,
        };
      });
    }

    return searchParams;
  },
);

export interface SearchParams {
  search?: { field: string; value: string }[];
  filter?: string;
}
