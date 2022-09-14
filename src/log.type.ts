import { OpenTelemetryAttributes } from './ot.attributes.js';

export interface LogFunc {
  (msg: string, attrs?: Partial<OpenTelemetryAttributes>): void;
}

/**
 * Expose log type so functions that do not have direct access to pino have access to the log type
 */
export interface LogType {
  level: string;
  setResource(key: string, value: unknown): void;
  trace: LogFunc;
  debug: LogFunc;
  info: LogFunc;
  warn: LogFunc;
  error: LogFunc;
  fatal: LogFunc;
  child: (attr: Partial<OpenTelemetryAttributes>) => LogType;
}
