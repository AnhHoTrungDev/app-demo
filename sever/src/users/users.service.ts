import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';
import { SALT_OR_ROUNDS } from '@environments';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findOne(useFilterQuery: FilterQuery<User>): Promise<User | any> {
    return this.userModel.findOne(useFilterQuery);
  }
  async create(
    email: string,
    rawPassword: string,
    fullName: string,
  ): Promise<User> {
    const password = await bcrypt.hash(rawPassword, SALT_OR_ROUNDS);
    const user = new this.userModel({
      email,
      password,
      fullName,
    });
    return user.save();
  }
}
