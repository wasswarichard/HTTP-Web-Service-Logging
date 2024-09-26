export type LogLevel = 'info' | 'warn' | 'error';

export class LogMessage {
  timestamp: Date;
  level: LogLevel;
  text: string;
}

export type SendLogRequest = LogMessage[];
