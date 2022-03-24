import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SALT_OR_ROUNDS } from '@environments';
import { User } from './schema/user.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  async findOne(useFilterQuery: Partial<User>): Promise<User> {
    return this.usersRepository.findOne(useFilterQuery);
  }

  async create(
    email: string,
    rawPassword: string,
    fullName: string,
  ): Promise<User> {
    try {
      const password = await bcrypt.hash(rawPassword, SALT_OR_ROUNDS);
      return await this.usersRepository.save(
        new User({ email, password, fullName }),
      );
    } catch (error) {
      return error;
    }
  }
}
