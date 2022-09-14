export type OpenTelemetryAttributes = {
  'error.id': string;
  'error.code': string;
  'error.message': string;
  'error.stack_trace': string;

  'http.method': string;
  'http.url': string;
  /** Http status code @example 203 */
  'http.status_code': number;
} & OpenTelemetryAttributesLinz;

export type LinzCatchAll = `linz.${string}`;
export type OpenTelemetryAttributesLinz = {
  [msg: string]: unknown;
};
