import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(30, { message: 'Password is too long (30 characters max)' })
  password: string;
}
