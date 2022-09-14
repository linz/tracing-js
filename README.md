# @linzjs/tracing
## Work In Progress 


LINZ's base for OpenTelemetry Tracing and logging


## Usage


## OpenTelemetry Log Data Model Logger

```typescript
import {log, LogType} from '@linzjs/tracing'

log.info('Hello World');
```

## Open Telemetry Tracer 

```typescript
import {trace} from '@linzjs/tracing'

const span = trace.startSpan();
await doWork();
span.close();
```