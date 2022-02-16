import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PublicFile {
  constructor(partial: Partial<PublicFile>) {
    Object.assign(this, partial);
  }

  @Expose()
  id?: string;

  @Expose()
  url?: string;

  key?: string;
}
