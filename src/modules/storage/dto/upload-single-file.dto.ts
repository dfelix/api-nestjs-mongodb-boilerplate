import { IsOptional, IsString } from 'class-validator';

export class UploadSingleFileDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  path?: string;
}
