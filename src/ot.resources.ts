export type OpenTelemetryResources = OpenTelemetryResourceHost &
  OpenTelemetryResourceTelemetry &
  OpenTelemetryResourceCloud &
  OpenTelemetryResourceContainer &
  OpenTelemetryResourceService;

export type OpenTelemetryResourceHost = {
  /** hostname of the host usually output of `hostname` */
  'host.name': string;
  /** Unique host id */
  'host.id': string;
  /** Ip address of host */
  'host.ip': string;
  /** MAC address of host */
  'host.mac': string[];
};

export type OpenTelemetryResourceTelemetry = {
  'telemetry.sdk.name': string;
  'telemetry.sdk.language': string;
  'telemetry.sdk.version': string;
};

export type OpenTelemetryResourceCloud = {
  /** ID of the account in the given cloud	 */
  'cloud.account.id': string;
  /** Availability zone in which this host is running.	 */
  'cloud.zone': string;
  'cloud.provider': 'aws' | 'gcp' | 'azure';
  /** Region in which this host is running.	 */
  'cloud.region': string;
  /** Instance ID of the host machine.	 */
  'cloud.instance.id': string;
  /** Instance name of the host machine. */
  'cloud.instance.name': string;
  /** Machine type of the host machine.	 */
  'cloud.machine.type': string;
};

export type OpenTelemetryResourceContainer = {
  /** Unique container id	 */
  'container.id': string;
  /** Name of the image the container was built on.	 */
  'container.image.name': string;
  'container.image.hash': string;
  /** Container name.	 */
  'container.name': string;
};

export type OpenTelemetryResourceService = {
  /** Name of the service data is collected from. */
  'service.name': string;
  /** Specific node serving that service */
  'service.instance.id': string;
  /** Version of the service the data was collected from.	 */
  'service.version': string;

  'service.state': string;
};
