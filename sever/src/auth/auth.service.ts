import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password === pass) {
      return { username: user.username, userId: user.userId };
    }
    return null;
  }

  async isHasUser(username: string): Promise<any> {
    return await this.usersService.findOne(username);
  }

  createToken(username: string, userId: string, expiresIn = '60s') {
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
