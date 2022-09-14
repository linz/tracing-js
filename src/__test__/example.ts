// log.info('Hello World');

import { log } from '../log.js';
import { otError } from '../ot.seralizer.js';

// log.trace('Hello World', undefined, { 'http.status': 200 });

// log.trace(new Error(), 'Hello');

log.info('Hello:error', { ...otError(new ReferenceError('This is a reference error')) });

log.setResource('host.name', 'blacha');
log.setResource('cloud.provider', 'aws');
log.setResource('cloud.machine.type', 'c5.xlarge');
log.setResource('cloud.region', 'ap-southeast-2');

log.setResources({ 'host.id': 'blacha', 'service.version': '1.0.3', 'service.name': '@blacha/pretty-json-log' });

log.info('Hello Message', { 'http.status_code': 203, 'http.duration': 12.2323 });

const traceChild = log.child().setTrace({ TraceId: '0af7651916cd43dd8448eb211c80319c' });

traceChild.warn('TraceOnly', { 'error.id': '32' });

// traceChild.child().setTrace({ TraceId: ''})
log
  .child()
  .setTrace({ TraceId: '0af7651916cd43dd8448eb211c80319c', SpanId: 'b9c7c989f97918e1' })
  .info('Traced', { 'http.method': 'GET' });

log.child().setTrace({ TraceId: '0af7651916cd43dd8448eb211c80319d', SpanId: 'b9c7c989f97918e1' }).warn('Missing User', {
  'http.method': 'GET',
  'http.url': '/v1/users/38575.json',
  'http.status_code': 403,
  duration: 12.2323,
});
