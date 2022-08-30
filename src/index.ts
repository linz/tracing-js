import { log } from './log.js';

// log.info('Hello World');

// log.trace('Hello World', undefined, { 'http.status': 200 });

// log.trace(new Error(), 'Hello');

log.info({ error: new Error('error') }, 'Hello:error');
log.info({ err: new Error('err') }, 'Hello:err');
log.info({ e: new Error('e') }, 'Hello:e');
