import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PaginationParams } from 'src/core/pagination/decorators/pagination.decorator';
import { SearchParams } from 'src/core/decorators/search.decorator';
import { PaginatedList } from 'src/core/pagination/interfaces/paginated-list';
import { PaginationAggregation } from 'src/core/pagination/pagination-aggregation';
import { User } from './entities/user.entity';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    await newUser.save();
    return new User(newUser.toObject());
  }

  async findAll(
    userFilterQuery: FilterQuery<User>,
    pagination?: PaginationParams,
    search?: SearchParams,
  ): Promise<PaginatedList<User>> {
    const pipeline = PaginationAggregation.getDefaultPipeline(
      userFilterQuery,
      pagination,
      search,
      ['email'],
    );

    const result = await this.userModel.aggregate(pipeline);

    if (result.length === 0) throw new Error('Invalid Aggregation');

    return {
      data: result[0].data.map((u: Partial<User>) => {
        return new User(u);
      }),
      pagination: {
        length: result[0].total,
        pageSize: pagination.limit,
        limit: pagination.limit,
      },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean({ virtuals: true });
    if (user && Object.keys(user).length > 0) return new User(user);
    return;
  }

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    const user = await this.userModel
      .findOne(userFilterQuery)
      .lean({ virtuals: true });
    if (user && Object.keys(user).length > 0) return new User(user);
    return;
  }

  async update(userFilterQuery: FilterQuery<User>, user: User): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(userFilterQuery, user, {
        new: true,
      })
      .lean({ virtuals: true });
    if (updatedUser && Object.keys(updatedUser).length > 0)
      return new User(updatedUser);
    return;
  }

  async remove(userFilterQuery: FilterQuery<User>): Promise<User> {
    const removedUser = await this.userModel
      .findOneAndDelete(userFilterQuery)
      .lean({ virtuals: true });
    if (removedUser && Object.keys(removedUser).length > 0)
      return new User(removedUser);
    return;
  }

  async setActivation(usersFilterQuery: FilterQuery<User>) {
    const user = await this.userModel.findOne(usersFilterQuery);
    user.set('activationCode', undefined);
    user.set('active', true);
    user.set('activatedAt', new Date());
    await user.save();
  }

  async setPassword(usersFilterQuery: FilterQuery<User>, password: string) {
    const user = await this.userModel.findOne(usersFilterQuery);
    user.set('resetToken', undefined);
    user.set('password', password);
    await user.save();
  }
}
