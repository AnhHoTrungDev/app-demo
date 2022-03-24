import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn() id: ObjectID;
  @Column() fullName: string;
  @Column() email: string;
  @Column() password?: string;
  @Column() isDeleted?: boolean = false;
  @Column() active = true;
  @Column() updateAt: Date = new Date();
  @Column() createAd: Date = new Date();
  @Column() updateBy = '';

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
