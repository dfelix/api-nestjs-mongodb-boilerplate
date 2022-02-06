import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = UserModel & Document;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class UserModel {
  @Prop({ required: true, unique: true, index: true })
  email?: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ required: true, default: false })
  active?: boolean;

  @Prop()
  activationAt?: Date;

  @Prop()
  activationCode?: string;

  @Prop()
  roles?: string[];

  @Prop({ required: true, default: false })
  archived?: boolean;

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

export const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.index({ email: 'text' });
