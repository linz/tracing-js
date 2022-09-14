import { hostname } from 'os';
import pino from 'pino';
import { LogType } from './log.type.js';
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

  trace(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.pino.trace({ Resource: this.resources, Attributes: { ...attrs } }, msg);
  }
  debug(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.pino.debug({ Resource: this.resources, Attributes: { ...attrs } }, msg);
  }
  info(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.pino.info({ Resource: this.resources, Attributes: { ...attrs } }, msg);
  }
  warn(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.pino.warn({ Resource: this.resources, Attributes: { ...attrs } }, msg);
  }
  error(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.pino.error({ Resource: this.resources, Attributes: { ...attrs } }, msg);
  }
  fatal(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.pino.fatal({ Resource: this.resources, Attributes: { ...attrs } }, msg);
  }
  child(attr: Partial<OpenTelemetryAttributes>): OtChildLogger {
    return new OtChildLogger(this, attr);
  }
}

export class OtChildLogger implements LogType {
  parent: LogType;
  attrs: Partial<OpenTelemetryAttributes>;
  constructor(parent: LogType, attrs: Partial<OpenTelemetryAttributes>) {
    this.parent = parent;
    this.attrs = attrs;
  }
  level: string;
  setResource<T extends keyof OpenTelemetryResources>(key: T, value: OpenTelemetryResources[T]): void {
    this.parent.setResource(key, value);
  }
  child(attr: Partial<OpenTelemetryAttributes>): OtChildLogger {
    return new OtChildLogger(this, attr);
  }
  trace(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.parent.trace(msg, { ...this.attrs, ...attrs });
  }
  debug(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.parent.debug(msg, { ...this.attrs, ...attrs });
  }
  info(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.parent.info(msg, { ...this.attrs, ...attrs });
  }
  warn(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.parent.warn(msg, { ...this.attrs, ...attrs });
  }
  error(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.parent.error(msg, { ...this.attrs, ...attrs });
  }
  fatal(msg: string, attrs?: Partial<OpenTelemetryAttributes>): void {
    this.parent.fatal(msg, { ...this.attrs, ...attrs });
  }
}
