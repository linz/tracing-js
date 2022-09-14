import { OpenTelemetryAttributes } from './ot.attributes.js';
import { OpenTelemetryResources } from './ot.resources.js';

export interface LogFunc {
  (msg: string, attrs?: Partial<OpenTelemetryAttributes>, traceContext?: OpenTelemetryTraceContext): void;
}

export interface OpenTelemetryTraceContext {
  TraceId: string;
  SpanId?: string;
  TraceFlags?: string;
}

/**
 * Expose log type so functions that do not have direct access to pino have access to the log typings
 */
export interface LogType {
  level: string;

  /** Set a resource key value pair, this will be set on the root logger */
  setResource<T extends keyof OpenTelemetryResources>(key: T, value: OpenTelemetryResources[T]): void;
  setResources(ctx: Partial<OpenTelemetryResources>): void;

  /** Set the current trace information */
  setTrace(ctx: OpenTelemetryTraceContext): this;

  trace: LogFunc;
  debug: LogFunc;
  info: LogFunc;
  warn: LogFunc;
  error: LogFunc;
  fatal: LogFunc;
  /** Create a child logger that has will log all the provided attributes */
  child(attr: Partial<OpenTelemetryAttributes>): LogType;
}
