import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerMiddleware } from 'common/service/MyLogger';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TYPEORM } from '@environments';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...TYPEORM,
      type: 'mongodb',
      // host: MLAB_HOST,
      // port: MLAB_PORT,
      // database: MLAB_DATABASE,
      // username: MLAB_USER,
      // password: MLAB_PASS,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // ssl: true,
      synchronize: true,
      autoLoadEntities: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
      logging: true,
    }),
    ConfigModule.forRoot({}),
    AuthModule,
    UsersModule,
    MediaModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
