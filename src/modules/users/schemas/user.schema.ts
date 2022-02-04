import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Prop()
  id?: string;

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

  // @Prop({
  //   type: MongooseSchema.Types.ObjectId,
  //   ref: 'Profile',
  // })
  // profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 'text' });
