import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class User {
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

  createdAt?: Date;

  updatedAt?: Date;

  lastLoginAt?: Date;

  activatedAt?: Date;
}
