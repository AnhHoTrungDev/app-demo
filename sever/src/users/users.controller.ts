import { Controller, Get, UseGuards, Body, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { CurrentUser } from 'common/decorator';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser) {
    return currentUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('log')
  log(@Query() query) {
    return query.log;
  }
}
