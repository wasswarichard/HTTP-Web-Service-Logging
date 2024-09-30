import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ReportingRequest {
  @IsDateString()
  @IsString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsString()
  @IsOptional()
  endDate: string;
}

export class ReportingResponse {
  startDate?: string;
  endDate?: string;
  infoCount: number;
  warningCount: number;
  errorCount: number;
  messageWithUrlCount: number;
}
