import { log } from './log.js';
import { otError } from './ot.seralizer.js';

export { log } from './log.js';
export { otError } from './ot.seralizer.js';
export { LogType } from './log.type.js';

export * from './ot.attributes.js';
export * from './ot.resources.js';

// log.info('Hello World');

// log.trace('Hello World', undefined, { 'http.status': 200 });

// log.trace(new Error(), 'Hello');

log.info('Hello:error', { ...otError(new Error('error')) });

log.setResource('host.name', 'blacha');
log.setResource('cloud.provider', 'aws');
log.setResource('cloud.machine.type', 'c5.xlarge');
log.setResource('cloud.region', 'ap-southeast-2');

log.info('Hello Message', { 'http.status_code': 203, 'http.duration': 12.2323 });
