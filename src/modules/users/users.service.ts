import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RandomString } from 'src/core/utils/generate-string';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import {
  Pagination,
  PaginationParams,
} from 'src/core/pagination/decorators/pagination.decorator';
import { Search, SearchParams } from 'src/core/decorators/search.decorator';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    // check if exists
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    if (user) throw new ConflictException('user-already-exists');

    // hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // create user object
    const newUser: User = {
      ...createUserDto,
      active: false,
      archived: false,
      password: hashedPassword,
      activationCode: RandomString.generate(5),
    };

    return this.usersRepository.create(newUser);
  }

  async findAll(pagination?: PaginationParams, search?: SearchParams) {
    return this.usersRepository.findAll({}, pagination, search);
  }

  async findById(id: string) {
    const user: User = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('user-not-found');
    return user;
  }

  async findOne(userFilterQuery: FilterQuery<User>) {
    const user: User = await this.usersRepository.findOne(userFilterQuery);
    if (!user) throw new NotFoundException('user-not-found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user: User = await this.usersRepository.update(
      { _id: id },
      { ...updateUserDto },
    );
    if (!user) throw new NotFoundException('user-not-found');
    return user;
  }

  async remove(id: string) {
    const user: User = await this.usersRepository.remove({ _id: id });
    if (!user) throw new NotFoundException('user-not-found');
    return user;
  }
}
