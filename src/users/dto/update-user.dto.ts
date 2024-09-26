import { PartialType } from '@nestjs/mapped-types';
import { RegistrationRequestDto } from './registration-request.dto';

export class UpdateUserDto extends PartialType(RegistrationRequestDto) {}
