import { UnauthorizedException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * NOTE Login run here
 */

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}
