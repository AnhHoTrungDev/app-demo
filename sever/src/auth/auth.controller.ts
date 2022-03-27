import {
  Controller,
  Post,
  UseGuards,
  Res,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Response as IResponse } from 'express';
import { JwtRefreshAuthGuard } from 'auth/guard/jwt.refresh.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from 'common/decorator';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

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
        userId: currentUser.userId,
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
  async register(
    @Res({ passthrough: true }) response: IResponse,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const currentUser = (await this.authService.createUser(
      createUserDto,
    )) as unknown as any;

    const { email: username, id: userId, fullName, errmsg } = currentUser;
    if (errmsg) {
      throw new BadRequestException(errmsg);
    }
    const result = await this.authService.login({
      username,
      userId,
      fullName,
    });
    const expiresValue = new Date(result.refresh_token.exp * 1000);
    response.cookie('refresh-token', 'Bearer ' + result.refresh_token.token, {
      httpOnly: true,
      expires: expiresValue,
    });

    return {
      ['current-user']: {
        username,
        fullName,
      },
      ...result.access_token,
      ['refresh-token-exp']: result.refresh_token.exp,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: IResponse) {
    response.clearCookie('refresh-token');
    return {};
  }
}
