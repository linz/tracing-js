import { OpenTelemetryAttributes } from './ot.attributes';

export function otError(e: unknown): Partial<OpenTelemetryAttributes> {
  const ot: Partial<OpenTelemetryAttributes> = {};
  const err = e instanceof Error ? e : new Error(String(e));

  ot['error.message'] = err.message;
  if ('id' in err) ot['error.id'] = err['id'];
  if ('code' in err) ot['error.code'] = String(err['code']);
  if (err.stack) ot['error.stack_trace'] = err.stack;

  return ot;
}
