import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, Model } from 'mongoose';
import { PaginationParams } from 'src/core/pagination/decorators/pagination.decorator';
import { SearchParams } from 'src/core/decorators/search.decorator';
import { PaginatedList } from 'src/core/pagination/interfaces/paginated-list';
import { PaginationAggregation } from 'src/core/pagination/pagination-aggregation';
import { User } from './entities/user.entity';
import { UserModel, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(user: UserModel): Promise<User> {
    const newUser = new this.userModel(user);
    await newUser.save();
    return plainToInstance(User, newUser);
  }

  async findAll(
    userFilterQuery: FilterQuery<User>,
    pagination?: PaginationParams,
    search?: SearchParams,
  ): Promise<PaginatedList<User>> {
    const query = PaginationAggregation.getQuery(
      userFilterQuery,
      pagination,
      search,
    );
    const users = await this.userModel.aggregate(query);
    const length = await this.userModel.count(query);

    return {
      data: plainToInstance(User, users),
      pagination: {
        length,
        pageSize: pagination.limit,
        limit: pagination.limit,
      },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    return plainToInstance(User, user);
  }

  async findOne(userFilterQuery: FilterQuery<UserModel>): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);
    return plainToInstance(User, user);
  }

  async update(
    userFilterQuery: FilterQuery<UserModel>,
    user: UserModel,
  ): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      userFilterQuery,
      user,
      {
        new: true,
      },
    );
    return plainToInstance(User, updatedUser);
  }

  async remove(userFilterQuery: FilterQuery<UserModel>): Promise<User> {
    const removedUser = await this.userModel.findOneAndDelete(userFilterQuery);
    return plainToInstance(User, removedUser);
  }
}
