import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { handerPaging } from 'utils';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getList(@Query() query) {
    const { page, limit = 10, ...queryRes } = query;
    const skip = +page === 1 ? 0 : (+page - 1) * +limit;
    const rs = await this.mediaService.getList(queryRes, +limit, +skip);
    const [data, total] = rs;
    return { data, paging: handerPaging(total, page) };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMedia(@Param() params) {
    return await this.mediaService.getMedia(params.id);
  }
}
