import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { trim } from 'lodash';
import { RoleTypeEnum } from '../../auth/role.constant';

export type roleStatus = 'ADMIN' | 'USER' | 'CREATOR';

export class RegistrationRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  @IsEnum(RoleTypeEnum)
  role: roleStatus;
}
