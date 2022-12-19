import { OtLogger } from './ot.log.js';
import { XrayTrace } from './x.ray.js';

export const log = new OtLogger();

log.setTrace({ TraceId: XrayTrace.id() });
