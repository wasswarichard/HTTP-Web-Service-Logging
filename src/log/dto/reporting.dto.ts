export class ReportingRequest {
  startDate?: string;
  endDate?: string;
}

export class ReportingResponse {
  startDate?: string;
  endDate?: string;
  infoCount: number;
  warningCount: number;
  errorCount: number;
  messageWithUrlCount: number;
}
