import { FilterQuery, Model } from 'mongoose';
import { PaginationParams } from './decorators/pagination.decorator';
import { SearchParams } from '../decorators/search.decorator';

export class PaginationAggregation {
  static getQuery(
    filterQuery: FilterQuery<any>,
    paginationParams?: PaginationParams,
    searchParams?: SearchParams,
  ): any {
    const aggregation = [];

    // sort, skip, limit
    if (paginationParams) {
      // &sort=+email
      if (paginationParams.sort && paginationParams.sort.length > 0) {
        let sort = {};
        paginationParams.sort.forEach((item) => {
          sort[item.field] = item.by === 'ASC' ? 1 : -1;
        });
        aggregation.push({ $sort: sort });
      }

      if (paginationParams.skip) {
        aggregation.push({ $skip: paginationParams.skip });
      }

      if (paginationParams.limit) {
        aggregation.push({ $limit: paginationParams.limit });
      }
    }

    // match
    if (searchParams) {
      const or = [];

      if (filterQuery && Object.keys(filterQuery).length > 0) {
        or.push(filterQuery);
      }

      if (searchParams.search && searchParams.search.length > 0) {
        searchParams.search.forEach((item) => {
          let i = {};
          i[item.field] = item.value;
          or.push(i);
        });
      }

      const match: any = {};

      if (searchParams.filter) {
        match.$text = {
          $search: searchParams.filter.trim(),
        };
      }

      if (or.length > 0) {
        match.$or = or;
      }

      aggregation.unshift({
        $match: match,
      });
    }

    return aggregation;
  }
}
