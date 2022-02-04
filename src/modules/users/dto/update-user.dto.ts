import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(8, 20)
  password: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsArray()
  roles: string[];

  @IsOptional()
  @IsBoolean()
  archived: boolean;
}
