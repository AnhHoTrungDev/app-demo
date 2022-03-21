import { Controller, Post, UseGuards, Res, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Response as IResponse } from 'express';
import { JwtRefreshAuthGuard } from 'auth/guard/jwt.refresh.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from 'common/decorator';
import { User } from 'users/schema/user.schema';
import { CreateUserDto } from 'users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: IResponse,
    @CurrentUser() currentUser,
  ) {
    const result = await this.authService.login(currentUser);
    const expiresValue = new Date(result.refresh_token.exp * 1000);
    response.cookie('refresh-token', 'Bearer ' + result.refresh_token.token, {
      httpOnly: true,
      expires: expiresValue,
    });

    return {
      ['current-user']: {
        username: currentUser.username,
        fullName: currentUser.fullName,
      },
      ...result.access_token,
      ['refresh-token-exp']: result.refresh_token.exp,
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh/token')
  refreshToken(@CurrentUser() currentUser) {
    const { username, userId, exp } = currentUser;
    return {
      ['current-user']: {
        username,
      },
      ...this.authService.createToken(username, userId),
      ['refresh-token-exp']: exp,
    };
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.createUser(createUserDto);
  }
}
