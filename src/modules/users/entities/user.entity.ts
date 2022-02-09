import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @Expose()
  id?: string;

  @Expose()
  email?: string;

  password?: string;

  active?: boolean;

  activationAt?: Date;

  activationCode?: string;

  @Expose()
  roles?: string[];

  archived?: boolean;

  resetToken?: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  lastLoginAt?: Date;

  activatedAt?: Date;
}
