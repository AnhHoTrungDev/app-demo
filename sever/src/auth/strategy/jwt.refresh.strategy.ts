import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Request as IRequest } from 'express';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: IRequest) => {
          return request?.cookies?.['refresh-token']?.split(' ')?.[1];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { userId, username, exp } = payload;

    const user = await this.authService.isHasUser(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: userId,
      username: username,
      exp: exp,
    };
  }
}
