import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Exclude()
  _id?: String;

  @Exclude()
  __v?: String;

  @Prop({ required: true, unique: true, index: true })
  email?: string;

  @Exclude()
  @Prop({ required: true })
  password?: string;

  @Exclude()
  @Prop({ required: true, default: false })
  active?: boolean;

  @Exclude()
  @Prop()
  activationAt?: Date;

  @Exclude()
  @Prop()
  activationCode?: string;

  @Prop()
  roles?: string[];

  @Exclude()
  @Prop({ required: true, default: false })
  archived?: boolean;

  @Exclude()
  @Prop()
  resetToken?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  activatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 'text' });
