import { OpenTelemetryAttributes } from './ot.attributes.js';
import * as ser from 'pino-std-serializers';

const has = <K extends string>(x: object, key: K): x is { [key in K]: unknown } => key in x;

/**
 * format a error to a open telemetry error format
 *
 * Which adds:
 * ```typescript
 * error.id: string
 * error.code: string
 * error.stack_trace: string
 * ```
 */
export function otError(e: unknown): Partial<OpenTelemetryAttributes> {
  const ot: Partial<OpenTelemetryAttributes> = {};
  const err = e instanceof Error ? e : new Error(String(e));
  const serialized = ser.err(err);

  ot['error.message'] = serialized.message;
  ot['error.type'] = serialized.type;
  if (has(err, 'id')) ot['error.id'] = String(err.id);
  if (has(err, 'code')) ot['error.code'] = String(err.code);
  if (serialized.stack) ot['error.stack_trace'] = serialized.stack;

  return ot;
}
