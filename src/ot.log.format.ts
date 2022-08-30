import pino from 'pino';

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

export function createOtPinoLogger(): pino.Logger {
  return pino({
    messageKey: 'Body',
    timestamp() {
      return `,"Timestamp":${Date.now()}`;
    },
    formatters: {
      level(label, num) {
        return { SeverityText: label.toUpperCase(), SeverityNumber: mapSeverity(num) };
      },
      bindings(bindings) {
        const { hostname } = bindings;
        return { Resources: { 'host.hostname': hostname } };
      },
      log(obj: any) {
        console.log(Object.keys(obj));
        const attrs = obj['Attributes'] ?? {};
        const error = obj['error'] ?? obj['err'] ?? obj['e'];
        if (error instanceof Error) {
          obj['error'] = undefined;
          obj['err'] = undefined;
          obj['e'] = undefined;
          if ('id' in error) attrs['error.id'] = error['id'];
          if ('code' in error) attrs['error.code'] = error['code'];
          if (error.message) attrs['error.message'] = error.message;
          obj.Attributes = attrs;
        }
        console.log({ attrs });
        return obj;
      },
    },
  });
}

export type ValidAttributes =
  | 'error.id'
  | 'error.code'
  | 'error.message'
  | 'error.stack_trace'
  | 'host.hostname'
  | 'host.domain';
