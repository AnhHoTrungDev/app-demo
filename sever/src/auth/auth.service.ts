import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { User } from 'users/schema/user.schema';
import { UsersService } from 'users/users.service';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const { email, password, fullName } = user;
    return this.usersService.create(email, password, fullName);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email: username });
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (isMatch) {
      return { username: user.email, userId: user.id, fullName: user.fullName };
    }
    return null;
  }

  async isHasUser(username: string): Promise<any> {
    return await this.usersService.findOne({ email: username });
  }

  createToken(username: string, userId: string, expiresIn = '1d') {
    const accessTokenValue = this.jwtService.sign(
      {
        username,
        userId,
      },
      {
        expiresIn,
      },
    );

    return {
      token: accessTokenValue,
      exp: this.jwtService.verify(accessTokenValue, {
        secret: jwtConstants.secret,
      }).exp,
    };
  }

  createRefreshTokenValue(username: string, userId: string, expiresIn = '7d') {
    const refreshTokenValue = this.jwtService.sign(
      {
        username,
        userId,
      },
      {
        expiresIn,
      },
    );

    return {
      token: refreshTokenValue,
      exp: this.jwtService.verify(refreshTokenValue, {
        secret: jwtConstants.secret,
      }).exp,
    };
  }

  // NOTE create token
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.createToken(payload.username, payload.sub);
    const refresh_token = this.createRefreshTokenValue(
      payload.username,
      payload.sub,
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
