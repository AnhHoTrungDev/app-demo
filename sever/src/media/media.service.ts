import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entity/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: MongoRepository<Media>,
  ) {}

  async getList(
    mediaFilterQuery: Partial<Media>,
    take = 10,
    skip = 0,
  ): Promise<[Media[], number]> {
    return this.mediaRepository.findAndCount({
      where: mediaFilterQuery,
      take,
      skip,
      cache: true,
    });
  }
  async getMedia(id) {
    return this.mediaRepository.findOne(id);
  }
}
