# @linzjs/tracing
## Work In Progress 


LINZ's base for OpenTelemetry Tracing and logging


## Usage


## OpenTelemetry Log Data Model Logger

```typescript
import {log, LogType} from '@linzjs/tracing'

log.info('Hello World');

// Use a minimal logging type in a function typing
function doWork(logger?: LogType) {
    logger?.info('Get User', { 'http.status': 203, 'http.url': '/v1/users/3857.json' });
}

// Setup resource and trace context for the logger
log.setResources({'host.name': 'blacha', 'cloud.provider': 'aws', 'cloud.region': 'ap-southeast-2' });
log.setTrace({'TraceId': '0af7651916cd43dd8448eb211c80319c'})
log.info('With Resources & TraceContext')
```

## Open Telemetry Tracer 

```typescript
import {trace} from '@linzjs/tracing'

const span = trace.startSpan();
await doWork();
span.close();
```