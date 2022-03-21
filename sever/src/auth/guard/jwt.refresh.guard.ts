import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * NOTE refresh token run here
 */

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refreshtoken') {}
