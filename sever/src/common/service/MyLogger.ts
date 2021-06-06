import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, baseUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const onAt = new Date().valueOf();

    response.on('close', () => {
      const onClose = new Date().valueOf();
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.debug(
        `🚀 ${method} ${url} \x1b[33m[${statusCode}] \x1b[32m${contentLength} - \x1b[33m${baseUrl} - \x1b[32m${userAgent} ->\x1b[35m[${ip}]\x1b[33m +${
          onClose - onAt
        }ms 👌`,
      );
    });

    next();
  }
}
