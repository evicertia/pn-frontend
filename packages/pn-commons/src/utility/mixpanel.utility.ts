// PN-1369 leave default import for mixpanel, using named once it won't work
import mixpanel from 'mixpanel-browser';

/**
 * Function that initialize Mixpanel (must be called once)
 */
export function mixpanelInit(mixpanelToken: string, nodeEnv: string): void {
  if (!nodeEnv || nodeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log('Mixpanel events mock on console log.');
  } else if (nodeEnv === 'test') {
    return;
  } else {
    mixpanel.init(mixpanelToken, {
      api_host: 'https://api-eu.mixpanel.com',
      persistence: 'localStorage',
      // if this is true, Mixpanel will automatically determine
      // City, Region and Country data using the IP address of
      // the client
      ip: false,
      // names of properties/superproperties which should never
      // be sent with track() calls
      property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
      debug: true,
      // function called after mixpanel has finished loading
    });
  }
}
