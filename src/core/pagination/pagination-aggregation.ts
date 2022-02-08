import { FilterQuery, Model } from 'mongoose';
import { PaginationParams } from './decorators/pagination.decorator';
import { SearchParam, SearchParams } from '../decorators/search.decorator';

export class PaginationAggregation {
  static getDefaultPipeline(
    filterQuery: FilterQuery<any>,
    paginationParams?: PaginationParams,
    searchParams?: SearchParams,
    fields?: string[],
  ): any {
    let pipeline = [];

    // return _id as id
    pipeline.push({
      $addFields: { id: '$_id' },
    });

    // base filter
    if (Object.keys(filterQuery).length > 0)
      pipeline.push({ $match: { $and: filterQuery } });

    // text filter
    if (Object.keys(searchParams.filter).length > 0)
      pipeline.push(this.getFilterStage(fields, searchParams.filter));

    // search in fields
    if (Object.keys(searchParams.search).length > 0)
      pipeline.push(this.getSearchStage(searchParams.search));

    // pagination
    if (Object.keys(paginationParams).length > 0)
      pipeline = pipeline.concat(this.getPaginationStages(paginationParams));

    return pipeline;
  }

  static getFilterStage(fields: string[], text?: string) {
    if (!text || text === '' || fields.length === 0) return { $match: {} };
    const regex = new RegExp(text, 'i');
    console.log(regex);
    const items = [];
    fields.forEach((field) => {
      let item = {};
      item[field] = {
        $regex: text,
        $options: 'i',
      };
      items.push(item);
    });
    // return { $match: { $and: [{ $or: or }] } };
    return { $match: { $and: items } };
  }

  static getSearchStage(params: SearchParam[]) {
    if (!params || params.length === 0) return { $match: {} };
    const items = [];
    params.forEach((param) => {
      let item = {};
      item[param.field] = param.value;
      items.push(item);
    });
    // return { $match: { $and: [{ $or: items }] } };
    return { $match: { $and: items } };
  }

  static getPaginationStages(paginationParams?: PaginationParams) {
    const stages = [];
    // sort, skip, limit
    if (paginationParams) {
      // &sort=+email
      if (paginationParams.sort && paginationParams.sort.length > 0) {
        let sort = {};
        paginationParams.sort.forEach((item) => {
          sort[item.field] = item.by === 'ASC' ? 1 : -1;
        });
        stages.push({ $sort: sort });
      }

      if (paginationParams.skip) {
        stages.push({ $skip: paginationParams.skip });
      }

      if (paginationParams.limit) {
        stages.push({ $limit: paginationParams.limit });
      }
    }
    return stages;
  }
}
