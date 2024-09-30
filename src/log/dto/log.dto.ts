import { Transform } from 'class-transformer';
import { trim } from 'lodash';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';

export type LogLevel = 'info' | 'warning' | 'error';

export enum LogLevelEnum {
  info = 'info',
  warning = 'warning',
  error = 'error',
}

export class LogMessageDto {
  @IsDateString()
  @IsString()
  timestamp: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  @IsEnum(LogLevelEnum)
  level: LogLevel;

  @IsString()
  text: string;
}

export type SendLogRequest = LogMessageDto[];

export class SendLogRequestDto {
  @ValidateNested({ each: true })
  @Type(() => LogMessageDto)
  @ArrayMinSize(1, {
    message: 'logs must contain an array of timestamp, level, text',
  })
  logs: LogMessageDto[];
}
