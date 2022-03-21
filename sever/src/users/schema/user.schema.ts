import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { commonSchema } from 'common/schema';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends commonSchema {
  @Prop()
  userId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({
    lowercase: true,
    unique: true,
    required: [true, 'Email not exists'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address.',
    ],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
