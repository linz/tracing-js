import { randomBytes } from 'node:crypto';

export const XrayTrace = {
  /** Byte length of the Trace ID /Span ID */
  Bytes: {
    TraceLength: 16,
    TraceDate: 4,
    TraceRandom: 12,
    SpanLength: 8,
  },
  id(): string {
    return Math.floor(Date.now() / 1000).toString(16) + randomBytes(XrayTrace.Bytes.TraceRandom).toString('hex');
  },
  spanId(): string {
    return randomBytes(XrayTrace.Bytes.SpanLength).toString('hex');
  },
};
