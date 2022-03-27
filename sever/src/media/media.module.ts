import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entity/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
