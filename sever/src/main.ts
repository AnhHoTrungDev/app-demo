import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from 'interceptor/all-exception.filter';
import { LoggingInterceptor } from 'interceptor/logging.interceptor';

const data = '["http://localhost:3000","https://www.website.com"]';
const whitelist = JSON.parse(data);

const logger = new Logger('Main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const PORT = process.env.APP_PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const isDevelopmentMode = NODE_ENV === 'development';
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: (origin, callback) => {
      if (isDevelopmentMode) {
        callback(null, true);
        return;
      }
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked cors 😢 for:`, origin);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(PORT, () => {
    logger.log(`Listening on port: ${PORT}`);
    logger.log(`Current node environment: ${NODE_ENV}`);
  });
}
bootstrap();
