import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('media')
export class Media {
  @ObjectIdColumn() id: ObjectID;
  @Column() videoLink: string;
  @Column() imgProview: string;
  @Column() img: string | null;
  @Column() isVideo: boolean;
  @Column() time: string | null;

  constructor(media?: Partial<Media>) {
    Object.assign(this, media);
  }
}
