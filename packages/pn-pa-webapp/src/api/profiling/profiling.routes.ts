import {compileRoute} from "@pagopa-pn/pn-commons";
import {StatusUpdateEnum} from "../../models/UsageEstimation";

// PREFIXES
const API_PROFILING_PREFIX = 'pn-usage-estimates';

// Segments
const API_VERSION = 'v1';
const API_PROFILING_SEGMENT = 'profilation';
const API_BILLING_SEGMENT = 'billing';

// Parameters
const API_PA_ID_PARAMETER = 'paId';
const API_REFERENCE_YEAR_PARAMETER = 'referenceYear';
const API_STATUS_PARAMETER = 'status';


// Paths
// v1/{paId}/billing/{referenceYear}
const API_PROFILING_UPDATE_PATH = `${API_VERSION}/:${API_PA_ID_PARAMETER}/${API_BILLING_SEGMENT}/:${API_REFERENCE_YEAR_PARAMETER}`;

// v1/billing/{paId}/profilation
const API_PROFILING_FROM_PAID_PATH = `${API_VERSION}/${API_BILLING_SEGMENT}/:${API_PA_ID_PARAMETER}/${API_PROFILING_SEGMENT}`;


export function PROFILING_UPDATE(paId: string, referenceYear: string, status: StatusUpdateEnum){
  return compileRoute({
    prefix: API_PROFILING_PREFIX,
    path: API_PROFILING_UPDATE_PATH,
    params: {
      [API_PA_ID_PARAMETER]: paId,
      [API_REFERENCE_YEAR_PARAMETER]: referenceYear,
    },
    query: {
      [API_STATUS_PARAMETER]: status
    }
  });
}

export function PROFILING_ALL_FROM_PAID(paId: string){
  return compileRoute({
    prefix: API_PROFILING_PREFIX,
    path: API_PROFILING_FROM_PAID_PATH,
    params: {
      [API_PA_ID_PARAMETER]: paId
    }
  });
}