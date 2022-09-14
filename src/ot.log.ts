import { hostname } from 'os';
import pino from 'pino';
import { LogType, OpenTelemetryTraceContext } from './log.type.js';
import { OpenTelemetryAttributes } from './ot.attributes.js';
import { OpenTelemetryResources } from './ot.resources.js';

function mapSeverity(num: number): number {
  switch (num) {
    case 10:
      return 1;
    case 20:
      return 5;
    case 30:
      return 9;
    case 40:
      return 13;
    case 50:
      return 17;
    case 60:
      return 21;
  }
  // Unknown severity? record it is as fatal for now
  return 24;
}

function createOtPinoLogger(): pino.Logger {
  return pino({
    messageKey: 'Body',
    timestamp() {
      /** Date needs to be a 64bit number */
      return `,"Timestamp":"${Date.now()}0000000"`;
    },
    formatters: {
      level(label, num) {
        return { SeverityText: label.toUpperCase(), SeverityNumber: mapSeverity(num) };
      },
      bindings() {
        // Remove the standard hostname/pid bindings
        return {};
      },
    },
  });
}

const hostName = hostname();

export class OtLogger implements LogType {
  pino: pino.Logger<pino.LoggerOptions>;
  resources: Partial<OpenTelemetryResources> = { 'host.name': hostName };
  attributes: Record<string, unknown> = {};
  traceContext?: OpenTelemetryTraceContext;

  constructor(pino = createOtPinoLogger()) {
    this.pino = pino;
  }

  get level(): string {
    return this.pino.level;
  }

  set level(level: string) {
    this.pino.level = level;
  }

  setResource<T extends keyof OpenTelemetryResources>(key: T, value: OpenTelemetryResources[T]): void {
    this.resources[key] = value;
  }

  setResources(ctx: Partial<OpenTelemetryResources>): void {
    Object.assign(this.resources, ctx);
  }

  setTrace(ctx: OpenTelemetryTraceContext): this {
    this.traceContext = ctx;
    return this;
  }

  getTrace(ctx?: OpenTelemetryTraceContext): OpenTelemetryTraceContext | undefined {
    return ctx ?? this.traceContext;
  }
  trace(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.pino.trace({ ...this.getTrace(ctx), Resource: this.resources, Attributes: attrs }, msg);
  }
  debug(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.pino.debug({ ...this.getTrace(ctx), Resource: this.resources, Attributes: attrs }, msg);
  }
  info(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.pino.info({ ...this.getTrace(ctx), Resource: this.resources, Attributes: attrs }, msg);
  }
  warn(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.pino.warn({ ...this.getTrace(ctx), Resource: this.resources, Attributes: attrs }, msg);
  }
  error(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.pino.error({ ...this.getTrace(ctx), Resource: this.resources, Attributes: attrs }, msg);
  }
  fatal(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.pino.fatal({ ...this.getTrace(ctx), Resource: this.resources, Attributes: attrs }, msg);
  }

  child(attr?: Partial<OpenTelemetryAttributes>): OtChildLogger {
    return new OtChildLogger(this, attr);
  }
}

export class OtChildLogger implements LogType {
  parent: LogType;
  attrs: Partial<OpenTelemetryAttributes>;
  traceContext: OpenTelemetryTraceContext;

  constructor(parent: LogType, attrs?: Partial<OpenTelemetryAttributes>) {
    this.parent = parent;
    this.attrs = attrs ?? {};
  }
  // TODO should a child have a different level to a parent
  get level(): string {
    return this.parent.level;
  }

  set level(level: string) {
    this.parent.level = level;
  }

  setResource<T extends keyof OpenTelemetryResources>(key: T, value: OpenTelemetryResources[T]): void {
    this.parent.setResource(key, value);
  }
  setResources(ctx: Partial<OpenTelemetryResources>): void {
    this.parent.setResources(ctx);
  }

  setTrace(ctx: OpenTelemetryTraceContext): this {
    this.traceContext = ctx;
    return this;
  }

  child(attr?: Partial<OpenTelemetryAttributes>): OtChildLogger {
    return new OtChildLogger(this, attr);
  }
  trace(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.parent.trace(msg, { ...this.attrs, ...attrs }, ctx ?? this.traceContext);
  }
  debug(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.parent.debug(msg, { ...this.attrs, ...attrs }, ctx ?? this.traceContext);
  }
  info(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.parent.info(msg, { ...this.attrs, ...attrs }, ctx ?? this.traceContext);
  }
  warn(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.parent.warn(msg, { ...this.attrs, ...attrs }, ctx ?? this.traceContext);
  }
  error(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.parent.error(msg, { ...this.attrs, ...attrs }, ctx ?? this.traceContext);
  }
  fatal(msg: string, attrs?: Partial<OpenTelemetryAttributes>, ctx?: OpenTelemetryTraceContext): void {
    this.parent.fatal(msg, { ...this.attrs, ...attrs }, ctx ?? this.traceContext);
  }
}
