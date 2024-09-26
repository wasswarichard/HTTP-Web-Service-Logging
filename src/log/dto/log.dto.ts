export type LogLevel = 'info' | 'warn' | 'error';

export class LogMessage {
  timestamp: string;
  level: LogLevel;
  text: string;
}

export type SendLogRequest = LogMessage[];
