import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegisterResponse {
  @Expose()
  id?: string;

  @Expose()
  messageId?: string;
}
