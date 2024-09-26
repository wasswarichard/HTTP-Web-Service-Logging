import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthenticationRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
