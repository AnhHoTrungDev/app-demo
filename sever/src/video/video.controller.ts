import {
  Controller,
  Get,
  //   Param,
  StreamableFile,
  //   UseGuards,
  Response,
  Query,
  BadRequestException,
} from '@nestjs/common';
// import { JwtRefreshAuthGuard } from 'auth/guard/jwt.refresh.guard';
// import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { createReadStream } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

import { join } from 'path';

@Controller('video')
export class VideoController {
  //   @UseGuards(JwtRefreshAuthGuard)
  @Get()
  async getMedia(
    @Response({ passthrough: true }) res,
    @Query() query,
  ): Promise<StreamableFile> {
    const { name } = query;
    const fileName: string = decodeURIComponent(name);
    if (!fileName) throw new BadRequestException();
    const link = join('/home/anh/Downloads', fileName);
    const mimeFile = mime?.contentType(fileName);
    const file = createReadStream(link);

    res.set({
      'Content-Type': mimeFile,
    });
    return new StreamableFile(file);
  }
}
