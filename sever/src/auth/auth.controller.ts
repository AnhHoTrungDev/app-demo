import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Response as IResponse } from 'express';
import { JwtRefreshAuthGuard } from 'auth/guard/jwt.refresh.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: IResponse) {
    const result = await this.authService.login(req.user);
    const expiresValue = new Date(result.refresh_token.exp * 1000);
    response.cookie('refresh-token', 'Bearer ' + result.refresh_token.token, {
      httpOnly: true,
      expires: expiresValue,
    });
    response.cookie('refresh-exp', result.refresh_token.exp, {
      expires: expiresValue,
    });
    return result.access_token;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh/token')
  refreshToken(@Request() req) {
    const { username, userId } = req.user;
    return this.authService.createToken(username, userId);
  }
}
