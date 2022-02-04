import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async update(userFilterQuery: FilterQuery<User>, user: User) {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, {
      new: true,
    });
  }

  async remove(userFilterQuery: FilterQuery<User>) {
    return this.userModel.findOneAndDelete(userFilterQuery);
  }
}
