import { IsString, MaxLength, MinLength } from 'class-validator';

export class ActivationDto {
  @IsString()
  @MinLength(5, { message: 'Activation code is too short (5 characters min)' })
  @MaxLength(5, { message: 'Activation code is too long (5 characters max)' })
  code: string;
}
