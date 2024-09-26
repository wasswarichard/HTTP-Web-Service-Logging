export class ReportingRequest {
  startDate?: string;
  endDate?: string;
}

export class ReportingResponse {
  startDate?: string;
  endDate?: string;
  warningCount: number;
  errorCount: number;
  messageWithUrlCount: number;
}
